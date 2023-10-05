import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";

export const createExam = async (req, res) => {
  const data = req.body;

  const exam = await prisma.exam.create({
    data,
  });

  console.log(exam);

  return res.json(exam);
};

export const getOpenExams = async (req, res) => {
  const latestExamsByEntrance = await prisma.entrance.findMany({
    include: {
      Exam: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  const filteredEntrances = latestExamsByEntrance.filter((entrance) => {
    const allowedStatus = ["APPLY", "SLOT"];
    return allowedStatus.includes(entrance.Exam[0].status);
  });

  return res.json(filteredEntrances);
};

export const checkExamValid = async (req, res) => {
  const id = req.params.id;
  const input = req.body;
  console.log(input);
  const lastExamWithEntranceCode = await prisma.exam.findFirst({
    where: {
      entrance: {
        code: input.code,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (
    !lastExamWithEntranceCode ||
    lastExamWithEntranceCode.id != id ||
    !isOpenForApplication(lastExamWithEntranceCode)
  ) {
    return res.json({ valid: false });
  }

  return res.json({ valid: true });
};

function isOpenForApplication(exam) {
  return exam.status === "APPLY";
}

export const getAllExams = async (req, res) => {
  const allexams = await prisma.exam.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(allexams);
};

export const getExamsByEntrance = async (req, res) => {
  const { entranceId } = req.params;
  const allexams = await prisma.exam.findMany({
    where: {
      entranceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(allexams);
};

export const updateExam = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const updatedExam = await prisma.exam.update({
    where: {
      id,
    },
    data,
  });

  return res.json(updatedExam);
};
