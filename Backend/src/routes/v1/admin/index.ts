import express from "express";
import { getAllUsers } from "../../../controllers/admin/userController";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFiles";
import {
  createProduct,
  updateProduct,
} from "../../../controllers/admin/productController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

router.post("/products", upload.array("images", 4), createProduct);
router.patch("/products", upload.array("images", 4), updateProduct);
// router.delete("/products", deleteProduct);

export default router;
