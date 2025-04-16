import { Router, RequestHandler } from "express";
import {
  createTransaction,
  deleteTransaction,
  getRecentTransactions,
  getTransactions,
} from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate as any, getTransactions as any);
router.get("/recents", authenticate as any, getRecentTransactions as any);
router.post("/", authenticate as any, createTransaction as any);
router.delete("/:id", authenticate as any, deleteTransaction as any);

export default router;
