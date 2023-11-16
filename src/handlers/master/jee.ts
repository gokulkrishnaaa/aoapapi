import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const createJee = async (req, res) => {
  const { description } = req.body;

  try {
    const newJee = await prisma.jee.create({
      data: {
        description: description,
      },
    });
    return res.json(newJee);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Error creating JEE");
  }
};

export const updateJee = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const jeeVersion = await prisma.jee.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!jeeVersion) {
    throw new BadRequestError("JEE does not exist`");
  }

  try {
    const updatedJee = await prisma.jee.update({
      where: {
        id: parseInt(id),
      },
      data,
    });
    return res.json(updatedJee);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("JEE cannot be updated");
  }
};

export const getAllJee = async (req, res) => {
  const allJeeOrderedByLatest = await prisma.jee.findMany({
    orderBy: {
      createdAt: "desc", // 'desc' for descending order, 'asc' for ascending order
    },
  });

  return res.json(allJeeOrderedByLatest);
};

export const getActiveJee = async (req, res) => {
  const latestActiveJee = await prisma.jee.findMany({
    where: {
      status: {
        in: ["ACTIVE", "PENDING"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  return res.json(latestActiveJee[0]);
};
