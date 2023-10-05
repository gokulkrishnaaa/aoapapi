import prisma from "../../db";

export const getStates = async (req, res) => {
  const data = await prisma.state.findMany();
  res.json(data);
};
