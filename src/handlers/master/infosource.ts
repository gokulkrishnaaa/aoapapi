import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getInfoSource = async (req, res) => {
  const data = await prisma.infoSource.findMany({
    orderBy: {
      id: "asc", // Sort by 'id' field in descending order
    },
  });
  res.json(data);
};

export const addInfoSource = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await prisma.infoSource.create({
      data: {
        name,
      },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding source");
  }
};

export const updateInfoSource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const item = await prisma.infoSource.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error updating source");
  }
};

export const removeInfoSource = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.infoSource.delete({
      where: { id: parseInt(id) },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error deleting source");
  }
};
