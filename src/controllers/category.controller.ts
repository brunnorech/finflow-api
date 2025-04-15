import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categorias", error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.userId!;

    const category = await prisma.category.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar categoria", error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar categoria", error });
  }
};
