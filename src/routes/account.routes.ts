import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getUserAccounts,
  updateAccount,
} from "../controllers/account.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate as any, getUserAccounts as any);
router.post("/", authenticate as any, createAccount as any);
router.put("/:id", authenticate as any, updateAccount as any);
router.delete("/:id", authenticate as any, deleteAccount as any);

export default router;
