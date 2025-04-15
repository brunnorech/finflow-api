import { Request, Response } from "express";
import { prisma } from "../services/prisma";

interface AuthenticatedRequest extends Request {
  userId: string;
}
export const createTransaction = async (req: Request, res: Response) => {
  const userId = req.userId!; // <- Agora reconhecido

  const { description, amount, type, payMethod, accountId, categoryId, date } =
    req.body;

  const transaction = await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      paymentMethod: payMethod,
      date: new Date(date),
      userId,
      accountId,
      categoryId,
    },
  });

  res.status(201).json(transaction);
};

export const getTransactions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar transações", error });
  }
};
