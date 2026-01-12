import express from "express";
import {
  getUserDetail,
  getUsers,
  updateUser,
} from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFiles";
import {
  createProduct,
  deleteProduct,
  getAdminProductDetail,
  getAdminProducts,
  updateProduct,
} from "../../../controllers/admin/productController";
import {
  changeReviewStatus,
  deleteReview,
  getReviews,
} from "../../../controllers/admin/reviewController";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryDetail,
  updateCategory,
} from "../../../controllers/admin/categoryController";
import { deleteType, getTypeList } from "../../../services/typeService";
import {
  getType,
  listTypes,
  removeType,
  storeType,
  updateTypeById,
} from "../../../controllers/admin/typeController";
import {
  getDashboardStats,
  getDetailedStats,
  getOrderDetail,
  updateOrderStatus,
} from "../../../controllers/admin/adminDashboardController";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.patch("/users", updateUser);

router.post("/maintenance", setMaintenance);

router.get("/products", getAdminProducts);
router.get("/products/:productId", getAdminProductDetail);
router.post("/products", upload.array("images", 4), createProduct);
router.patch("/products", upload.array("images", 4), updateProduct);
router.delete("/products", deleteProduct);

router.get("/reviews", getReviews);
router.patch("/reviews/status", changeReviewStatus);
router.delete("/reviews", deleteReview);

router.get("/categories", getCategories);
router.get("/categories/:categoryId", getCategoryDetail);
router.post("/categories", createCategory);
router.patch("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);

router.get("/types", listTypes);
router.get("/types/:typeId", getType);
router.post("/types", storeType);
router.patch("/types/:typeId", updateTypeById);
router.delete("/types/:typeId", removeType);

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/stats/detailed", getDetailedStats);

router.get("/orders/:orderId", getOrderDetail);
router.put("/orders/:orderId/status", updateOrderStatus);

export default router;
