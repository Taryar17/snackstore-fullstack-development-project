import express from "express";
import {
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFiles";
import { getMyPhoto } from "../../../controllers/api/profileController";
import {
  getProduct,
  getProductsByPagination,
} from "../../../controllers/api/productController";

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

export default router;
