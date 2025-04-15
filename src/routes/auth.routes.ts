import { Router, Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser as (req: Request, res: Response) => void);
router.post("/login", loginUser as (req: Request, res: Response) => void);

export default router;
