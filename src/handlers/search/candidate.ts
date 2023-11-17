import prisma from "../../db";

export const searchCandidate = async (req, res) => {
  const { phone, email, name } = req.body;

  if (phone) {
    const candidates = await prisma.candidate.findMany({
      where: {
        phone: {
          contains: phone,
        },
      },
      include: {
        Onboarding: true,
      },
    });
    return res.json(candidates);
  }
  if (email) {
    const candidate = await prisma.candidate.findUnique({
      where: {
        email,
      },
      include: {
        Onboarding: true,
      },
    });
    const result = candidate ? [candidate] : [];
    return res.json(result);
  }
  if (name) {
    const candidates = await prisma.candidate.findMany({
      where: {
        fullname: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        Onboarding: true,
      },
    });
    return res.json(candidates);
  }
  return res.json([]);
};
