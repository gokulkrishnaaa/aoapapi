import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";
import XLSX from "xlsx";

export const getCandidatesByAgent = async (req, res) => {
  const { id } = req.params;

  const agent = prisma.agent.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!agent) {
    throw new BadRequestError("Agent not found");
  }

  const candidatesByAgentId = await prisma.candidate.findMany({
    where: {
      agentId: parseInt(id),
    },
    include: {
      Onboarding: true,
    },
  });

  return res.json(candidatesByAgentId);
};
