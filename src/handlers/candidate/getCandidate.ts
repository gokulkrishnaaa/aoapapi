import prisma from "../../db";

export const getCandidate = async (req, res) => {
  const { id } = req.currentUser;
  let candidate = await prisma.candidate.findFirst({
    where: {
      id,
    },
    include: {
      gender: true,
      socialstatus: true,
      infosource: true,
      state: true,
      district: true,
      city: true,
    },
  });
  return res.json(candidate);
};

export const getCandidateById = async (req, res) => {
  const { id } = req.params;
  let candidate = await prisma.candidate.findFirst({
    where: {
      id,
    },
    include: {
      gender: true,
      socialstatus: true,
      infosource: true,
      state: true,
      district: true,
      city: true,
    },
  });
  return res.json(candidate);
};
