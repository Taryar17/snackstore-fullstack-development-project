// Backend/src/controllers/cartController.ts
import { Request, Response } from "express";
import { cartService } from "../../services/cartService";

interface CustomRequest extends Request {
  userId: number;
}

export class CartController {
  // Add item to cart
  async addToCart(req: CustomRequest, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.userId;

      const productIdNum = Number(productId);
      const quantityNum = Number(quantity);

      if (isNaN(productIdNum) || isNaN(quantityNum)) {
        return res.status(400).json({ error: "Invalid productId or quantity" });
      }

      const result = await cartService.addToCart(productId, quantity, userId);
      res.json(result);
    } catch (error: any) {
      console.error("Error adding to cart:", error);

      if (error.message.includes("Product not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Insufficient stock") ||
        error.message.includes("not available")
      ) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to add to cart" });
    }
  }

  // Get cart items
  async getCart(req: CustomRequest, res: Response) {
    try {
      const userId = req.userId;
      const result = await cartService.getCart(userId);
      res.json(result);
    } catch (error: any) {
      console.error("Error getting cart:", error);
      res.status(500).json({ error: "Failed to get cart" });
    }
  }

  // Update cart item quantity
  async updateCartItem(req: CustomRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      const { productId, quantity } = req.body;
      const userId = req.userId;

      const productIdNum = Number(productId);
      const quantityNum = Number(quantity);

      if (isNaN(productIdNum) || isNaN(quantityNum)) {
        return res.status(400).json({ error: "Invalid productId or quantity" });
      }

      const result = await cartService.updateCartItem(
        sessionId,
        productIdNum,
        quantityNum,
        userId
      );
      res.json(result);
    } catch (error: any) {
      console.error("Error updating cart:", error);

      if (error.message.includes("Cart item not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Insufficient stock")) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to update cart" });
    }
  }

  // Remove item from cart
  async removeCartItem(req: CustomRequest, res: Response) {
    try {
      const { sessionId, productId } = req.params;
      const userId = req.userId;
      const productIdNum = Number(productId);

      if (isNaN(productIdNum)) {
        return res.status(400).json({ error: "Invalid productId" });
      }
      const result = await cartService.removeCartItem(
        sessionId,
        productIdNum,
        userId
      );
      res.json(result);
    } catch (error: any) {
      console.error("Error removing item:", error);

      if (
        error.message.includes("Cart session not found") ||
        error.message.includes("Cart item not found")
      ) {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to remove item" });
    }
  }

  // Clear entire cart
  async clearCart(req: CustomRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      const userId = req.userId;

      const result = await cartService.clearCart(sessionId, userId);
      res.json(result);
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  }

  // Cleanup expired carts (admin endpoint)
  async cleanupExpiredCarts(req: CustomRequest, res: Response) {
    try {
      const result = await cartService.cleanupExpiredCarts();
      res.json({
        success: true,
        message: `Cleaned up ${result.cleaned} expired cart sessions`,
      });
    } catch (error: any) {
      console.error("Error cleaning up carts:", error);
      res.status(500).json({ error: "Failed to clean up carts" });
    }
  }
}

export const cartController = new CartController();
