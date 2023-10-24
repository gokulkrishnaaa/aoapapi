import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const getCities = async (req, res) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: "asc", // 'asc' for ascending order, 'desc' for descending
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
      orderBy: {
        id: "asc",
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

export const addCity = async (req, res) => {
  try {
    const data = req.body;
    const item = await prisma.city.create({
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding City");
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.city.update({
      where: { id: parseInt(id) },
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error updating City");
  }
};

export const removeCity = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.city.delete({
      where: { id: parseInt(id) },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error deleting City");
  }
};
