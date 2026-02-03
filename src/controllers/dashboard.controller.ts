import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDashboard = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const userId = req.userId as any;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);

    // 1. Receita e despesa do mês
    const income = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "INCOME",
        date: { gte: monthStart, lte: monthEnd },
      },
    });

    const expense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: monthStart, lte: monthEnd },
      },
    });

    const total = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "INCOME",
      },
    });

    const monthlySummary = [];

    for (let i = 5; i >= 0; i--) {
      const refDate = subMonths(monthStart, i);
      const refStart = startOfMonth(refDate);
      const refEnd = endOfMonth(refDate);

      const [incomeAgg, expenseAgg] = await Promise.all([
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            type: "INCOME",
            date: { gte: refStart, lte: refEnd },
          },
        }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            type: "EXPENSE",
            date: { gte: refStart, lte: refEnd },
          },
        }),
      ]);

      monthlySummary.push({
        name: format(refDate, "MMM", { locale: ptBR }),
        income: incomeAgg._sum.amount || 0,
        expense: expenseAgg._sum.amount || 0,
      });
    }

    const groupedByCategory = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: monthStart, lte: monthEnd },
      },
      _sum: {
        amount: true,
      },
    });

    const expensesByCategory = await Promise.all(
      groupedByCategory.map(
        async (item: {
          categoryId: string | null;
          _sum: { amount: number | null };
        }) => {
          if (!item.categoryId) {
            return { name: "Sem categoria", value: item._sum.amount || 0 };
          }
          const category = await prisma.category.findUnique({
            where: { id: item.categoryId },
          });
          return {
            name: category?.name || "Sem categoria",
            value: item._sum.amount || 0,
          };
        }
      )
    );

    res.json({
      totalBalance: total._sum.amount || 0,
      monthlyIncome: income._sum.amount || 0,
      monthlyExpense: expense._sum.amount || 0,
      monthlySavings: (income._sum.amount || 0) - (expense._sum.amount || 0),
      monthlySummary,
      expensesByCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar dashboard", error });
  }
};
