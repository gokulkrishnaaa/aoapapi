import prisma from "../../db";
import { createJWT } from "../../modules/auth";

export const putOnboarding = async (req, res) => {
  const { id } = req.currentUser;
  console.log(req.currentUser);

  const { data, candidate } = req.body;

  const onboarding = await prisma.onboarding.update({
    where: {
      candidateId: id,
    },
    data,
  });

  let user = { ...req.currentUser };
  user.onboarding = onboarding.current;
  user.onboardingstatus = onboarding.status;
  user.role = "candidate";
  if (candidate) {
    user = { ...user, ...candidate };
  }

  const token = createJWT(user);

  // Store it on session object
  req.session.jwt = token;
  return res.json({ onboarding });
};

export const putAgentOnboarding = async (req, res) => {
  const { data } = req.body;

  const onboarding = await prisma.onboarding.upsert({
    where: {
      candidateId: data.candidateId,
    },
    update: data, // Update the existing record if it exists
    create: data,
  });

  return res.json({ onboarding });
};
