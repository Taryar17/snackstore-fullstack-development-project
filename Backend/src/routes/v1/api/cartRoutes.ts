import express from "express";
import { cartController } from "../../../controllers/api/cartController";
import { auth } from "../../../middlewares/auth";

const router = express.Router();

// Add item to cart
router.post("/add", auth, (req, res) =>
  cartController.addToCart(req as any, res)
);

// Get cart items
router.get("/", auth, (req, res) => cartController.getCart(req as any, res));

// Update cart item quantity
router.patch("/:sessionId", auth, (req, res) =>
  cartController.updateCartItem(req as any, res)
);

// Remove item from cart
router.delete("/:sessionId/item/:productId", auth, (req, res) =>
  cartController.removeCartItem(req as any, res)
);

// Clear entire cart
router.delete("/:sessionId", auth, (req, res) =>
  cartController.clearCart(req as any, res)
);

// Cleanup expired carts
router.post("/cleanup", auth, (req, res) =>
  cartController.cleanupExpiredCarts(req as any, res)
);

export default router;
