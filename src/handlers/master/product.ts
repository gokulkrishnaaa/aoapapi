import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getProducts = async (req, res) => {
  const data = await prisma.products.findMany({
    orderBy: {
      id: "asc", // Sort by 'id' field in descending order
    },
  });
  res.json(data);
};

export const getProductByCode = async (req, res) => {
  const { code } = req.params;

  const product = await prisma.products.findUnique({
    where: {
      code,
    },
  });

  res.json(product);
};

export const addProduct = async (req, res) => {
  try {
    const data = req.body;
    const created = await prisma.products.create({
      data,
    });
    return res.json(created);
  } catch (error) {
    throw new InternalServerError("Error adding Product");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.products.update({
      where: { id: parseInt(id) },
      data,
    });
    return res.json(updated);
  } catch (error) {
    throw new InternalServerError("Error updating Product");
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    return res.json(deleted);
  } catch (error) {
    throw new InternalServerError("Error deleting gender");
  }
};
