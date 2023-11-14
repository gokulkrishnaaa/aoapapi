import prisma from "../../db";

export const getCandidateParent = async (req, res) => {
  console.log("nocandidate");
  const { id } = req.currentUser;
  console.log("nocandidate", id);

  let candidate = await prisma.parentInfo.findFirst({
    where: {
      candidateId: id,
    },
  });
  return res.json(candidate);
};

export const getCandidateParentById = async (req, res) => {
  const { id } = req.params;
  console.log("nocandidate", id);

  let candidate = await prisma.parentInfo.findFirst({
    where: {
      candidateId: id,
    },
  });
  return res.json(candidate);
};
