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
    const userId = req.userId;

    const pageParam = parseInt(req.query.page as string, 10);
    const pageSizeParam = parseInt(req.query.pageSize as string, 10);

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize =
      Number.isNaN(pageSizeParam) || pageSizeParam < 1 || pageSizeParam > 100
        ? 10
        : pageSizeParam;

    const rawType = (req.query.type as string | undefined)?.toUpperCase();
    const search =
      (req.query.search as string | undefined) ||
      (req.query.q as string | undefined) ||
      "";

    const where: any = {
      userId,
    };

    if (rawType === "INCOME" || rawType === "EXPENSE") {
      where.type = rawType;
    }

    if (search) {
      where.OR = [
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          account: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: true,
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.transaction.count({
        where,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    res.json({
      data: transactions,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
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

export const deleteTransaction = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const userId = req.userId;

    const deleted = await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Transação não encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar transacao", error });
  }
};
