import { NextFunction, Router } from "express";
import {
  createCategory,
  getUserCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate as any, getUserCategories as any);
router.post("/", authenticate as any, createCategory as any);
router.put("/:id", authenticate as any, updateCategory as any);
router.delete("/:id", authenticate as any, deleteCategory as any);

export default router;
