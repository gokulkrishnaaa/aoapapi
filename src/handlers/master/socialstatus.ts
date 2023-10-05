import prisma from "../../db";

export const getSocialStatus = async (req, res) => {
  const data = await prisma.socialStatus.findMany();
  res.json(data);
};
