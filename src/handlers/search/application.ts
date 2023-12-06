import prisma from "../../db";

export const searchApplication = async (req, res) => {
  const { aeee, jee } = req.body;

  if (aeee) {
    const applications = await prisma.examApplication.findMany({
      where: {
        reference: {
          contains: aeee,
          mode: "insensitive",
        },
      },
      include: {
        candidate: true,
        Registration: true,
        EntrancePayments: true,
      },
    });
    return res.json(applications);
  }

  if (jee) {
    const applications = await prisma.jEEApplication.findMany({
      where: {
        reference: {
          contains: jee,
          mode: "insensitive",
        },
      },
      include: {
        candidate: true,
        JEEPayments: true,
      },
    });

    return res.json(applications);
  }

  return res.json([]);
};
