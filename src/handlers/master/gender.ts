import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getGender = async (req, res) => {
  const data = await prisma.gender.findMany({
    orderBy: {
      id: "asc", // Sort by 'id' field in descending order
    },
  });
  res.json(data);
};

export const addGender = async (req, res) => {
  try {
    const { name } = req.body;
    const newGender = await prisma.gender.create({
      data: {
        name,
      },
    });
    return res.json(newGender);
  } catch (error) {
    throw new InternalServerError("Error adding gender");
  }
};

export const updateGender = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedGender = await prisma.gender.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    return res.json(updatedGender);
  } catch (error) {
    throw new InternalServerError("Error updating gender");
  }
};

export const removeGender = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGender = await prisma.gender.delete({
      where: { id: parseInt(id) },
    });
    return res.json(deletedGender);
  } catch (error) {
    throw new InternalServerError("Error deleting gender");
  }
};
