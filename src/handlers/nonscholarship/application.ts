import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

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
