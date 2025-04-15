import { Router, RequestHandler } from "express";
import {
  createTransaction,
  getTransactions,
} from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getTransactions as any);
router.post("/", authenticate, createTransaction as any);

export default router;
