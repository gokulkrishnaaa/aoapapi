import prisma from "../../db";

export const createCandidateParent = async (req, res) => {
  const { id } = req.currentUser;
  const data = req.body;
  console.log(data);

  const candidate = await prisma.parentInfo.upsert({
    where: {
      candidateId: id,
    },
    update: data,
    create: { ...data, candidateId: id },
  });
  return res.json(candidate);
};

export const createAgentCandidateParent = async (req, res) => {
  const data = req.body;

  const candidate = await prisma.parentInfo.upsert({
    where: {
      candidateId: data.candidateId,
    },
    update: data,
    create: data,
  });
  return res.json(candidate);
};
