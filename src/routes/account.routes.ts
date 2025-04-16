import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  getUserAccounts,
} from "../controllers/account.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// router.get("/", authenticate as any, getAccounts);
router.get("/", authenticate as any, getUserAccounts as any);
router.post("/", authenticate as any, createAccount);
router.delete("/:id", authenticate as any, deleteAccount);

export default router;
