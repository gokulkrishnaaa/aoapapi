import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

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
      orderBy: {
        name: "asc", // 'asc' for ascending order, 'desc' for descending
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

export const addDistrict = async (req, res) => {
  try {
    const data = req.body;
    const item = await prisma.district.create({
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding District");
  }
};

export const updateDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.district.update({
      where: { id: parseInt(id) },
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error updating District");
  }
};

export const removeDistrict = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.district.delete({
      where: { id: parseInt(id) },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error deleting District");
  }
};
