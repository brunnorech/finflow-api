import { Router } from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getCategories);
router.post("/", authenticate, createCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
