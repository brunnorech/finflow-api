import { Request, Response } from "express";
import { prisma } from "../services/prisma";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    const {
      description,
      amount,
      type,
      paymentMethod,
      accountId,
      categoryId,
      date,
    } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        paymentMethod,
        date: new Date(date),
        userId,
        accountId,
        categoryId,
      },
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao criar transação", error: error.message });
  }
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

export const getRecentTransactions = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const userId = req.userId;

    const limit = parseInt(req.query.limit as string) || 5;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
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

export const deleteTransaction = async (req: Request & { userId: string }, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar transacao", error });
  }
}