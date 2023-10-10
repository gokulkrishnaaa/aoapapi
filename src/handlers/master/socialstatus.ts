import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getSocialStatus = async (req, res) => {
  const data = await prisma.socialStatus.findMany({
    orderBy: {
      id: "asc", // Sort by 'id' field in descending order
    },
  });
  res.json(data);
};

export const addSocialStatus = async (req, res) => {
  try {
    const { name } = req.body;
    const item = await prisma.socialStatus.create({
      data: {
        name,
      },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding social status");
  }
};

export const updateSocialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const item = await prisma.socialStatus.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error updating social status");
  }
};

export const removeSocialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.socialStatus.delete({
      where: { id: parseInt(id) },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error deleting social status");
  }
};
