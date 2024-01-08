import prisma from "../../db";

export const searchApplication = async (req, res) => {
  const { aeee, jee, appno } = req.body;

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

  if (appno) {
    const applications = await prisma.examApplication.findMany({
      where: {
        reference: {
          contains: appno,
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

  return res.json([]);
};

export const searchRegistration = async (req, res) => {
  const { regno } = req.body;
  const registrationDetails = await prisma.registration.findMany({
    where: {
      registrationNo: {
        equals: parseInt(regno),
      },
    },
    include: {
      examapplication: {
        include: {
          exam: true,
          candidate: true,
          EntrancePayments: true,
        },
      },
    },
  });

  return res.json(registrationDetails);
};
