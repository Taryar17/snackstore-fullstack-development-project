import { prisma } from "./prismaClient";
import { CartSessionStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";
import { stockWSS } from "..";

export class CartService {
  private async broadcastStockUpdate(productId: number) {
    try {
      if (stockWSS) {
        await stockWSS.broadcastStockUpdate(productId);
      }
    } catch (error) {
      console.error("Failed to broadcast stock update:", error);
    }
  }

  // Add item to cart with transaction and locking
  async addToCart(productId: number, quantity: number, userId?: number) {
    if (!productId || productId <= 0) {
      throw new Error("Invalid product ID");
    }

    if (!quantity || quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    if (quantity > 99) {
      throw new Error("Maximum quantity is 99");
    }

    return await prisma
      .$transaction(
        async (tx) => {
          // Lock the product row for update
          const product = await tx.product.findUnique({
            where: { id: productId },
            select: {
              id: true,
              inventory: true,
              reserved: true,
              status: true,
            },
          });

          if (!product) {
            throw new Error("Product not found");
          }

          if (product.status !== "ACTIVE") {
            throw new Error("Product is not available");
          }

          const available = product.inventory - product.reserved;

          if (available < quantity) {
            throw new Error(
              `Insufficient stock. Available: ${available}, Requested: ${quantity}`
            );
          }

          // Find or create cart session
          let session = await tx.cartSession.findFirst({
            where: {
              userId: userId || null,
              status: "ACTIVE",
              expiresAt: { gt: new Date() },
            },
          });

          if (!session) {
            session = await tx.cartSession.create({
              data: {
                userId: userId || null,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
              },
            });
          }

          // Check existing cart item with lock
          const existingItem = await tx.cartItem.findUnique({
            where: {
              sessionId_productId: {
                sessionId: session.id,
                productId,
              },
            },
          });

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            // Update with atomic operation
            await tx.$executeRaw`
            UPDATE "Product" 
            SET reserved = reserved + ${quantity}
            WHERE id = ${productId} 
            AND inventory - reserved >= ${quantity}
          `;

            const updated = await tx.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: newQuantity },
            });

            // Verify the update was successful
            const updatedProduct = await tx.product.findUnique({
              where: { id: productId },
              select: { reserved: true, inventory: true },
            });

            const updatedAvailable =
              updatedProduct!.inventory - updatedProduct!.reserved;

            return {
              success: true,
              sessionId: session.id,
              message: "Item added to cart",
              availableStock: updatedAvailable,
              quantity: newQuantity,
            };
          } else {
            // Add new item with atomic operation
            await tx.$executeRaw`
            UPDATE "Product" 
            SET reserved = reserved + ${quantity}
            WHERE id = ${productId} 
            AND inventory - reserved >= ${quantity}
          `;

            await tx.cartItem.create({
              data: {
                sessionId: session.id,
                productId,
                quantity,
              },
            });

            const updatedProduct = await tx.product.findUnique({
              where: { id: productId },
              select: { reserved: true, inventory: true },
            });

            const updatedAvailable =
              updatedProduct!.inventory - updatedProduct!.reserved;

            return {
              success: true,
              sessionId: session.id,
              message: "Item added to cart",
              availableStock: updatedAvailable,
              quantity,
            };
          }
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      )
      .then(async (result) => {
        // Broadcast stock update AFTER transaction completes
        await this.broadcastStockUpdate(productId);
        return result;
      })
      .catch((error) => {
        console.error("Cart transaction failed:", error);
        throw error;
      });
  }

  // Get cart items with accurate stock
  async getCart(userId?: number) {
    const session = await prisma.cartSession.findFirst({
      where: {
        userId: userId || null,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return { items: [], sessionId: null };
    }

    // Get fresh stock data for each product
    const itemsWithStock = await Promise.all(
      session.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            inventory: true,
            reserved: true,
          },
        });

        const available = product
          ? Math.max(0, product.inventory - product.reserved)
          : 0;

        return {
          id: item.productId,
          name: item.product.name,
          price: Number(item.product.price),
          quantity: item.quantity,
          image: item.product.images[0]?.path || "",
          availableStock: available,
        };
      })
    );

    return {
      sessionId: session.id,
      items: itemsWithStock,
      expiresAt: session.expiresAt,
    };
  }

  // Update cart item quantity
  async updateCartItem(
    sessionId: string,
    productId: number,
    quantity: number,
    userId?: number
  ) {
    // Verify session belongs to user
    const session = await prisma.cartSession.findFirst({
      where: {
        id: sessionId,
        userId: userId || null,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
      include: {
        items: {
          where: { productId },
          include: { product: true },
        },
      },
    });

    if (!session || session.items.length === 0) {
      throw new Error("Cart item not found");
    }

    const item = session.items[0];
    const quantityDiff = quantity - item.quantity;

    if (quantityDiff === 0) {
      return { success: true };
    }

    const product = item.product;
    const available = product.inventory - product.reserved;

    // For decreasing quantity, we need different validation
    if (quantityDiff > 0 && quantityDiff > available) {
      throw new Error(
        `Insufficient stock. Available: ${available}, Requested: ${quantityDiff}`
      );
    }

    return await prisma
      .$transaction(
        async (tx) => {
          // Update reserved stock
          await tx.product.update({
            where: { id: productId },
            data: { reserved: { increment: quantityDiff } },
          });

          // Update cart item
          await tx.cartItem.update({
            where: { id: item.id },
            data: { quantity },
          });

          return { success: true };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      )
      .then(async (result) => {
        // Broadcast stock update AFTER transaction completes
        await this.broadcastStockUpdate(productId);
        return result;
      })
      .catch((error) => {
        console.error("Update cart transaction failed:", error);
        throw error;
      });
  }

  // Remove item from cart
  async removeCartItem(sessionId: string, productId: number, userId?: number) {
    // Verify session belongs to user
    const session = await prisma.cartSession.findFirst({
      where: {
        id: sessionId,
        userId: userId,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new Error("Cart session not found");
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        sessionId,
        productId,
      },
      include: { product: true },
    });

    if (!item) {
      throw new Error("Cart item not found");
    }

    return await prisma
      .$transaction(
        async (tx) => {
          // Release reserved stock
          await tx.product.update({
            where: { id: productId },
            data: { reserved: { decrement: item.quantity } },
          });

          // Remove cart item
          await tx.cartItem.delete({
            where: { id: item.id },
          });

          return { success: true };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      )
      .then(async (result) => {
        // Broadcast stock update AFTER transaction completes
        await this.broadcastStockUpdate(productId);
        return result;
      })
      .catch((error) => {
        console.error("Remove cart item transaction failed:", error);
        throw error;
      });
  }

  // Clear entire cart
  async clearCart(sessionId: string, userId?: number) {
    // Verify session belongs to user
    const session = await prisma.cartSession.findFirst({
      where: {
        id: sessionId,
        userId: userId || null,
        status: "ACTIVE",
      },
      include: { items: { include: { product: true } } },
    });

    if (!session) {
      return { success: true };
    }

    return await prisma
      .$transaction(
        async (tx) => {
          // Release all reserved stock
          const updatePromises = session.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: { reserved: { decrement: item.quantity } },
            })
          );

          await Promise.all(updatePromises);

          // Mark session as expired
          await tx.cartSession.update({
            where: { id: sessionId },
            data: { status: "EXPIRED" },
          });

          return { success: true };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      )
      .then(async (result) => {
        // Broadcast stock updates for all products in cart
        const broadcastPromises = session.items.map((item) =>
          this.broadcastStockUpdate(item.productId)
        );
        await Promise.all(broadcastPromises);
        return result;
      })
      .catch((error) => {
        console.error("Clear cart transaction failed:", error);
        throw error;
      });
  }

  // Cleanup expired carts (for cron job)
  async cleanupExpiredCarts() {
    const expiredSessions = await prisma.cartSession.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ expiresAt: { lt: new Date() } }, { status: "CONVERTED" }],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    let cleaned = 0;

    for (const session of expiredSessions) {
      await prisma.$transaction(async (tx) => {
        // Release reserved stock for each item
        for (const item of session.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              reserved: { decrement: item.quantity },
            },
          });
        }

        // Mark session as expired
        await tx.cartSession.update({
          where: { id: session.id },
          data: { status: "EXPIRED" },
        });
      });

      // Broadcast stock updates for all products in expired session
      const broadcastPromises = session.items.map((item) =>
        this.broadcastStockUpdate(item.productId)
      );
      await Promise.all(broadcastPromises);

      cleaned++;
    }

    return { cleaned };
  }

  async cleanupStaleCartSessions() {
    const staleSessions = await prisma.cartSession.findMany({
      where: {
        OR: [
          {
            status: "ACTIVE",
            expiresAt: { lt: new Date() },
          },
          {
            status: "ACTIVE",
            items: {
              none: {},
            },
          },
        ],
      },
      include: {
        items: true,
      },
    });

    for (const session of staleSessions) {
      // Release any reserved stock
      for (const item of session.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            reserved: { decrement: item.quantity },
          },
        });

        await this.broadcastStockUpdate(item.productId);
      }

      // Mark as expired
      await prisma.cartSession.update({
        where: { id: session.id },
        data: { status: "EXPIRED" },
      });
    }

    return { cleaned: staleSessions.length };
  }
}

export const cartService = new CartService();
