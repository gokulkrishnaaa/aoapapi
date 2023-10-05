import prisma from "../../db";

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
