import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_forte";

export const authenticate = (
  req: Request & { userId: string },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido" });
    return; // <- aqui
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: { userId: string } = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
    return; // <- aqui também
  }
};
