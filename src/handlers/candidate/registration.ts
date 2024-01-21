import prisma from "../../db";

export const checkCandidateRegistered = async (req, res) => {
  const { id } = req.params;

  // check if candidate is registered for aeee
  const aeeeApplication = await prisma.examApplication.findFirst({
    where: {
      candidateId: id,
      status: "REGISTERED",
    },
  });

  if (aeeeApplication) {
    return res.json({ result: true });
  }

  const jeeApplication = await prisma.jEEApplication.findFirst({
    where: {
      candidateId: id,
      status: "REGISTERED",
    },
  });

  if (jeeApplication) {
    return res.json({ result: true });
  }

  return res.json({ result: false });
};
