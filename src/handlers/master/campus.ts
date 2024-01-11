import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const addCampus = async (req, res) => {
  // check for empty string throw bad request error
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Name is invalid");
  }
  // create campus
  let item = null;
  try {
    // item = await prisma.campus.create({
    //   data: {
    //     name,
    //   },
    // });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError("Campus already exists", "name");
      } else {
        throw new BadRequestError("Cannot process the request");
      }
    } else {
      throw new BadRequestError("Cannot process the request");
    }
  }

  return res.json(item);
};

export const getCampus = async (req, res) => {
  const data = await prisma.campus.findMany({
    orderBy: {
      id: "asc", // Sort by 'id' field in descending order
    },
  });
  res.json(data);
};

export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedGender = await prisma.campus.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    return res.json(updatedGender);
  } catch (error) {
    throw new InternalServerError("Error updating Campus");
  }
};

export const removeCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGender = await prisma.campus.delete({
      where: { id: parseInt(id) },
    });
    return res.json(deletedGender);
  } catch (error) {
    throw new InternalServerError("Error deleting Campus");
  }
};
