import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export const getUserCategories = async (
  req: Request & { userId: string },
  res: Response
) => {
  const userId = req.userId;
  const type = req.query.type as "INCOME" | "EXPENSE" | undefined;

  const where: any = { userId };
  if (type) where.type = type;

  const categories = await prisma.category.findMany({ where });
  res.json(categories);
};

export const createCategory = async (
  req: Request & { userId: string },
  res: Response
) => {
  try {
    const { name, type } = req.body;
    const userId = req.userId as any;

    const category = await prisma.category.create({
      data: {
        type,
        name,
        userId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar categoria", error });
  }
};

export const updateCategory = async (
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

    const category = await prisma.category.updateMany({
      where: { id, userId },
      data: { name, type },
    });

    if (category.count === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const updated = await prisma.category.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar categoria", error });
  }
};

export const deleteCategory = async (
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

    const deleted = await prisma.category.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar categoria", error });
  }
};
