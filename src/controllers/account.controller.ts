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

export const createAccount = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const { name, type } = req.body;
    const userId = req.userId;

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

export const updateAccount = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { name, type } = req.body;
    const userId = req.userId;

    const account = await prisma.account.updateMany({
      where: { id, userId },
      data: { name, type },
    });

    if (account.count === 0) {
      return res.status(404).json({ message: "Conta não encontrada" });
    }

    const updated = await prisma.account.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar conta", error });
  }
};

export const deleteAccount = async (
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

    const deleted = await prisma.account.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Conta não encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar conta", error });
  }
};
