import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const createJee = async (req, res) => {
  const { examId, description } = req.body;

  const entrance = await prisma.entrance.findUnique({
    where: {
      code: "AEEE",
    },
  });

  const latestExam = await prisma.exam.findMany({
    where: {
      entranceId: entrance.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1, // Retrieve only the latest entry
  });

  if (latestExam[0].id != examId) {
    throw new BadRequestError("Not a valid exam");
  }

  // check if the exam status is ok to create jee
  const allowedStatus = ["APPLY", "SLOT"];
  const isValidExam = allowedStatus.includes(latestExam[0].status);

  if (!isValidExam) {
    throw new BadRequestError("Not a valid exam");
  }

  try {
    const newJee = await prisma.jee.create({
      data: {
        description: description,
        examId: examId,
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
  const { description } = req.body;

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
        id: jeeVersion.id,
      },
      data: {
        description,
      },
    });
    return res.json(updatedJee);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("JEE cannot be updated");
  }

  return res.json("doog");
};

export const getAllJee = async (req, res) => {
  const jeesWithDetails = await prisma.jee.findMany({
    include: {
      exam: {
        include: {
          entrance: true,
        },
      },
    },
  });

  return res.json(jeesWithDetails);
};

export const getActiveJee = async (req, res) => {
  const entrance = await prisma.entrance.findUnique({
    where: {
      code: "AEEE",
    },
  });

  const latestExam = await prisma.exam.findMany({
    where: {
      entranceId: entrance.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1, // Retrieve only the latest entry
  });

  // check if the exam status is ok to create jee
  const allowedStatus = ["APPLY", "SLOT"];
  const isValidExam = allowedStatus.includes(latestExam[0].status);
  if (!isValidExam) {
    return res.json(null);
  }
  const jeeWithExam = await prisma.jee.findUnique({
    where: {
      examId: latestExam[0].id,
    },
    include: {
      exam: {
        include: {
          entrance: true,
        },
      },
    },
  });

  return res.json(jeeWithExam);
};
