import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getCityForExam = async (req, res) => {
  const entranceId = req.params.entranceId;

  const examCities = await prisma.examCity.findMany({
    where: {
      entranceId,
    },
    include: {
      city: true,
    },
  });

  return res.json(examCities);
};

export const getExamCityByState = async (req, res) => {
  const stateId = req.params.stateId;
  const entranceId = req.params.entranceId;

  const examCities = await prisma.examCity.findMany({
    where: {
      entranceId,
      city: {
        district: {
          stateId: parseInt(stateId),
        },
      },
    },
    include: {
      city: true,
    },
  });

  return res.json(examCities);
};

export const addCityForEntrance = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const item = await prisma.examCity.create({
      data,
    });
    return res.json(item);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error adding City");
  }
};

export const updateCityForEntrance = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.examCity.update({
      where: { id: parseInt(id) },
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error updating District");
  }
};

export const removeCityForEntrance = async (req, res) => {
  try {
    const { entranceId, cityId } = req.params;
    console.log(entranceId);
    console.log(cityId);

    const item = await prisma.examCity.delete({
      where: {
        entranceId_cityId: {
          entranceId: entranceId,
          cityId: parseInt(cityId),
        },
      },
    });
    return res.json(item);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error deleting District");
  }
};
