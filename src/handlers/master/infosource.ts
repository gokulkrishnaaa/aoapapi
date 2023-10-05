import prisma from "../../db";

export const getInfoSource = async (req, res) => {
  const data = await prisma.infoSource.findMany();
  res.json(data);
};
