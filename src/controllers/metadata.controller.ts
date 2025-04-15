import { Request, Response } from "express";

export const getMetadata = (_: Request, res: Response) => {
  const transactionTypes = ["INCOME", "EXPENSE"];
  const accountTypes = ["CORRENTE", "POUPANCA", "CREDITO", "CARTEIRA", "OUTRA"];
  const paymentMethods = [
    "PIX",
    "CREDITO",
    "DEBITO",
    "BOLETO",
    "DINHEIRO",
    "OUTRO",
  ];

  res.json({
    transactionTypes,
    accountTypes,
    paymentMethods,
  });
};
