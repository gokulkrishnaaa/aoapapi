import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";

export const getDistrictsFromState = async (req, res) => {
  const stateId = parseInt(req.params.stateId);

  if (!stateId) {
    throw new BadRequestError("Input is invalid");
  }

  try {
    const districts = await prisma.district.findMany({
      where: {
        stateId,
      },
    });
    return res.json(districts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  } finally {
    await prisma.$disconnect();
  }
};
