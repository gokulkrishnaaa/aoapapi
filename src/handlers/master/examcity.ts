import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";

export const getCityForExam = async (req, res) => {
  const entranceId = req.params.entranceid;
  console.log(entranceId);

  const data = await prisma.entrance
    .findUnique({
      where: { id: entranceId },
    })
    .ExamCity();
  res.json(data);
};

export const addCityForEntrance = async (req, res) => {
  try {
    const data = req.body;
    const item = await prisma.examCity.create({
      data,
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding District");
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
    const { id } = req.params;
    const item = await prisma.examCity.delete({
      where: { id: parseInt(id) },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error deleting District");
  }
};
