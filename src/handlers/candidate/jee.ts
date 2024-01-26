import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const createJeeApplication = async (req, res) => {
  const { jeeId } = req.body;
  const { id } = req.currentUser;
  const randomNumber = Math.floor(Date.now());
  const reference = `JEE-${randomNumber}`;

  try {
    const newJEEApplication = await prisma.jEEApplication.create({
      data: {
        reference: reference,
        candidate: {
          connect: { id },
        },
        jee: {
          connect: { id: jeeId },
        },
      },
    });
    return res.json(newJEEApplication);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Application cannot be created");
  }
};

export const getJeeApplicationByJeeId = async (req, res) => {
  const { jeeid } = req.params;
  const { id } = req.currentUser;

  console.log("this is here");

  const jeeApplication = await prisma.jEEApplication.findFirst({
    where: {
      jeeId: parseInt(jeeid),
      candidateId: id,
    },
    include: {
      jee: true,
    },
  });

  return res.json(jeeApplication);
};

export const getJeeApplicationById = async (req, res) => {
  const { id } = req.params;

  const jeeApplication = await prisma.jEEApplication.findUnique({
    where: {
      id,
    },
    include: {
      jee: true, // Include details of the associated Jee
      candidate: true,
      JEEPayments: true,
    },
  });

  return res.json(jeeApplication);
};

export const getJeeApplicationByCandidateId = async (req, res) => {
  const { id } = req.currentUser;

  console.log("latestApplication");

  const latestApplication = await prisma.jEEApplication.findFirst({
    where: {
      candidateId: id, // Replace with the actual candidateId you want to query
    },
    orderBy: {
      createdAt: "desc", // Order by createdAt in descending order to get the latest application first
    },
    include: {
      candidate: true,
      jee: true,
    },
  });

  return res.json(latestApplication);
};

export const updateJeeApplication = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const updated = await prisma.jEEApplication.update({
    where: {
      id,
    },
    data,
  });

  return res.json(updated);
};
