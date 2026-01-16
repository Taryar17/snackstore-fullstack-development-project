import express from "express";
import {
  getOrderDetail,
  getUserOrders,
  updateProfileValidation,
  updateUserProfile,
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFiles";
import { getMyPhoto } from "../../../controllers/api/profileController";
import {
  checkStockAvailability,
  getCategoryType,
  getPreorderProductsByPagination,
  getProduct,
  getProductsByPagination,
  getProductStock,
  toggleFavourite,
} from "../../../controllers/api/productController";
import {
  createReview,
  getProductReviews,
} from "../../../controllers/api/reviewController";
import {
  createOrder,
  getUserCheckoutInfo,
} from "../../../controllers/api/orderController";
import { authData } from "../../../controllers/authControllers";
import { cartController } from "../../../controllers/api/cartController";

const router = express.Router();

router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);
router.patch(
  "/profile/upload/optimize",
  auth,
  upload.single("avatar"),
  uploadProfileOptimize
);
router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple
);
router.get("/profile/my-photo", getMyPhoto); // Just for testing

router.get("/products/:id", auth, getProduct);
router.get("/products", auth, getProductsByPagination);
router.get("/preorder-products", auth, getPreorderProductsByPagination);
router.get("/products/:id/stock", auth, getProductStock);

router.post("/reviews", auth, createReview);
router.get("/reviews/:productId", auth, getProductReviews);

router.get("/filter-type", auth, getCategoryType);
router.patch("/products/toggle-favourite", auth, toggleFavourite);

router.get("/checkout-info", auth, getUserCheckoutInfo);
router.post("/orders", auth, createOrder);
router.get("/authdata", auth, authData);

router.get("/profile", auth, authData);
router.put("/profile", auth, updateProfileValidation, updateUserProfile);
router.get("/profile/orders", auth, getUserOrders);
router.get("/profile/orders/:orderId", auth, getOrderDetail);

router.post("/add", auth, (req, res) =>
  cartController.addToCart(req as any, res)
);
export default router;
