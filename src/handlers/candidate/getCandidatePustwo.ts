import prisma from "../../db";

export const getCandidatePustwo = async (req, res) => {
  const { id } = req.currentUser;
  let candidate = await prisma.plusTwoInfo.findFirst({
    where: {
      candidateId: id,
    },
    include: {
      state: true,
    },
  });
  return res.json(candidate);
};

export const getCandidatePlustwoById = async (req, res) => {
  const { id } = req.params;
  let candidate = await prisma.plusTwoInfo.findFirst({
    where: {
      candidateId: id,
    },
    include: {
      state: true,
    },
  });
  return res.json(candidate);
};
