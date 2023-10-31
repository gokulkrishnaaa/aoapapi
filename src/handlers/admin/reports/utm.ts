import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getUTMReport = async (req, res) => {
  try {
    const utmWithCandidates = await prisma.utm.findMany({
      include: { candidate: true },
    });
    return res.json(utmWithCandidates);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
