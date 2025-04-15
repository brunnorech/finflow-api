import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {}; // 👈 MUITO IMPORTANTE: impede que esse arquivo vire um módulo isolado
