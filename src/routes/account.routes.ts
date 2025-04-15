import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
} from "../controllers/account.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getAccounts);
router.post("/", authenticate, createAccount);
router.delete("/:id", authenticate, deleteAccount);

export default router;
