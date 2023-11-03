import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getRefererReport = async (req, res) => {
  try {
    const urlCounts = await prisma.referer.groupBy({
      by: ["url"],
      _count: {
        url: true,
      },
    });

    const resultArr = urlCounts as any[];

    return res.json(resultArr);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
