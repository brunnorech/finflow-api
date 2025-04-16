import { NextFunction, Router } from "express";
import {
  createCategory,
  getUserCategories,
  deleteCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();


router.get("/", authenticate as any, getUserCategories as any);
router.post("/", authenticate as any, createCategory as any);
router.delete("/:id", authenticate as any, deleteCategory);

export default router;
