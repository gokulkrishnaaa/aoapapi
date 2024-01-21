import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";
import { sendNonSchWelcome } from "../email/nonschwelcome";

export const createNonSchApplication = async (req, res) => {
  const { candidateId, nonscholarshipId, programmes } = req.body;
  let reference = `NONSCH-${Math.floor(Date.now())}`;
  // first create application
  let application = null;
  try {
    application = await prisma.nonScholarshipApplication.create({
      data: {
        candidateId,
        nonscholarshipId,
        reference,
      },
    });
    await Promise.all(
      programmes.map((programme, index) => {
        const nonscholarshipapplicationId = application.id;
        return prisma.nonSchApplicationProgrammes.create({
          data: {
            nonscholarshipapplicationId,
            programmesId: programme.id,
            order: index + 1, // Using index + 1 to start order from 1 instead of 0
          },
        });
      })
    );

    return res.json({ application });
  } catch (error) {
    if (application) {
      await prisma.nonScholarshipApplication.delete({
        where: {
          id: application.id,
        },
      });
    }
    throw new InternalServerError("Application creation error");
  }
};

export const getNonSchAppnlByCandidateId = async (req, res) => {
  const { candidateid, intakeid } = req.params;
  const application = await prisma.nonScholarshipApplication.findUnique({
    where: {
      candidateId_nonscholarshipId: {
        candidateId: candidateid,
        nonscholarshipId: intakeid,
      },
    },
  });

  return res.json(application);
};

export const getNonSchAppnlById = async (req, res) => {
  const { id } = req.params;
  const application = await prisma.nonScholarshipApplication.findUnique({
    where: {
      id,
    },
    include: {
      NonSchApplicationProgrammes: {
        orderBy: {
          order: "asc", // Sorting by 'order' in ascending order
        },
        include: {
          programmes: true,
        },
      },
    },
  });

  return res.json(application);
};

export const updateNonSchApplication = async (req, res) => {
  const { id } = req.params;
  const { programmes, status } = req.body;

  const application = await prisma.nonScholarshipApplication.findUnique({
    where: {
      id,
    },
    include: {
      candidate: true,
    },
  });
  if (!application) {
    throw new BadRequestError("Application not found");
  }

  if (programmes) {
    await prisma.nonSchApplicationProgrammes.deleteMany({
      where: {
        nonscholarshipapplicationId: application.id,
      },
    });
    await Promise.all(
      programmes.map((programme, index) => {
        const nonscholarshipapplicationId = application.id;
        return prisma.nonSchApplicationProgrammes.create({
          data: {
            nonscholarshipapplicationId,
            programmesId: programme.programmes.id,
            order: index + 1, // Using index + 1 to start order from 1 instead of 0
          },
        });
      })
    );
  }

  if (status) {
    await prisma.nonScholarshipApplication.update({
      where: {
        id: application.id, // Replace with the actual application ID
      },
      data: {
        status, // Replace with the new status
      },
    });
    if (status === "APPLIED") {
      sendNonSchWelcome(application.candidate);
    }
  }

  return res.json(application);
};
