import prisma from "../../db";

export const getFullAeeeDetailsByCandidateId = async (req, res) => {
  const { candidateId } = req.params;

  let application = await prisma.examApplication.findFirst({
    where: {
      candidateId,
    },
    include: {
      Registration: true,
      exam: {
        include: {
          entrance: true, // Include Entrance details
        },
      },
      ApplicationCities: {
        include: {
          examcity: {
            include: {
              city: true, // Include City details
            },
          },
        },
        orderBy: {
          id: "asc", // Sorting by id in ascending order
        },
      },
      EntrancePayments: true,
      ApplicationJEE: true,
    },
    orderBy: {
      createdAt: "desc", // Sorting by createdAt in descending order
    },
  });
  return res.json(application);
};

export const getFullJeeDetailsByCandidateId = async (req, res) => {
  const { candidateId } = req.params;

  let application = await prisma.jEEApplication.findFirst({
    where: {
      candidateId,
    },
    include: {
      JEEPayments: true,
    },
    orderBy: {
      createdAt: "desc", // Sorting by createdAt in descending order
    },
  });
  return res.json(application);
};
