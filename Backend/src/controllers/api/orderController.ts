// controllers/orderController.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { Prisma } from "../../../generated/prisma/client";

interface CustomRequest extends Request {
  userId?: number;
}

export const createOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  if (!userId) {
    return next(
      createError("User not authenticated", 401, errorCode.unauthenticated)
    );
  }

  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return next(createError("User not found", 404, errorCode.notFound));
    }

    // Get cart items from request body
    const { items, totalPrice } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(createError("Cart is empty", 400, errorCode.invalid));
    }

    // Generate order code
    const orderCode = `ORD${Date.now()}`.slice(0, 15);
    const totalPriceDecimal = new Prisma.Decimal(totalPrice);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          userId,
          code: orderCode,
          totalPrice: totalPriceDecimal,
          status: "PENDING",
        },
      });

      // 2. Create order items
      const orderProducts = await Promise.all(
        items.map(async (item: any) => {
          // Check product availability
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { inventory: true, price: true },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.inventory < item.quantity) {
            throw new Error(
              `Insufficient inventory for product ${item.productId}`
            );
          }

          // Update inventory
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });

          return tx.productsOnOrder.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price, // Use database price
            },
          });
        })
      );

      return { order, orderProducts };
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: result.order.id,
      orderCode: result.order.code,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return next(
      createError(
        error.message || "Failed to create order",
        500,
        errorCode.server
      )
    );
  }
};

// Get user info for checkout (pre-fill form)
export const getUserCheckoutInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  if (!userId) {
    return next(
      createError("User not authenticated", 401, errorCode.unauthenticated)
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    let formattedPhone = user!.phone || "";

    if (formattedPhone && !formattedPhone.startsWith("09")) {
      formattedPhone = "09" + formattedPhone;
    }

    if (!user) {
      return next(createError("User not found", 404, errorCode.notFound));
    }

    res.status(200).json({
      message: "User info retrieved",
      user: {
        ...user,
        phone: formattedPhone,
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return next(createError("Failed to get user info", 500, errorCode.server));
  }
};
