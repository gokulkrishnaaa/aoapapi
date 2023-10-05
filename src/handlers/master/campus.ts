import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";

export const createCampus = async (req, res) => {
  // check for empty string throw bad request error
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Name is invalid");
  }
  // create campus
  let item = null;
  try {
    item = await prisma.campus.create({
      data: {
        name,
      },
    });
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
  const data = await prisma.campus.findMany();
  res.json(data);
};
