import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const createNonSchIntake = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newNonScholarship = await prisma.nonScholarship.create({
      data: {
        name,
        description,
      },
    });

    return res.json({ item: newNonScholarship });
  } catch (error) {
    throw new InternalServerError("Exam could not be created");
  }
};

export const getNonSchIntake = async (req, res) => {
  const intake = await prisma.nonScholarship.findFirst({
    where: {
      status: "APPLY",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(intake);
};

export const getCurrentNonSchIntake = async (req, res) => {
  const intake = await prisma.nonScholarship.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(intake);
};
