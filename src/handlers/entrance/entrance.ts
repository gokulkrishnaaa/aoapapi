import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const createEntrance = async (req, res) => {
  const data = req.body;

  const entrance = await prisma.entrance.create({
    data,
  });

  return res.json(entrance);
};

export const getEntrances = async (req, res) => {
  const data = req.body;

  const entrances = await prisma.entrance.findMany();

  return res.json(entrances);
};

export const removeEntrance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.entrance.delete({
      where: { id },
    });
    return res.json(deleted);
  } catch (error) {
    throw new InternalServerError("Error deleting Entrance");
  }
};

export const updateEntrance = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log("id", id);
    console.log("data", data);

    const updated = await prisma.entrance.update({
      where: { id },
      data,
    });
    return res.json(updated);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error updating Entrance");
  }
};
