import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export const getAccounts = async (_: Request, res: Response) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar contas", error });
  }
};

export const getUserAccounts = async (
  req: Request & { userId: string },
  res: Response
) => {
  const userId = req.userId;
  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  res.json(accounts);
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, type, userId } = req.body;

    const account = await prisma.account.create({
      data: {
        name,
        type,
        userId,
      },
    });

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar conta", error });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.account.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar conta", error });
  }
};
