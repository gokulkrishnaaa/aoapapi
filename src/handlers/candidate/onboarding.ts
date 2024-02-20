import prisma from "../../db";

export const completeOnboarding = async (req, res) => {
  const { id } = req.currentUser;
  const data = req.body;

  if (data.stateId === 9999999999) {
    delete data.stateId;
  } else {
    delete data.otherState;
  }

  const candidate = await prisma.plusTwoInfo.upsert({
    where: {
      candidateId: id,
    },
    update: data,
    create: { ...data, candidateId: id },
  });

  return res.json(candidate);
};
