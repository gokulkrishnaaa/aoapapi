import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
export const getCityFromDistrict = async (req, res) => {
  const districtId = parseInt(req.params.districtId);

  if (!districtId) {
    throw new BadRequestError("Input is invalid");
  }

  try {
    const cities = await prisma.city.findMany({
      where: {
        districtId,
      },
    });
    return res.json(cities);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  } finally {
    await prisma.$disconnect();
  }
};
