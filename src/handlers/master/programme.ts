import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";

export const createProgramme = async (req, res) => {
  // check for empty string throw bad request error
  const { campusId, courseId, code } = req.body;
  if (!courseId || !campusId || !code) {
    throw new BadRequestError("Input is invalid");
  }

  let item = null;
  try {
    item = await prisma.programmes.create({
      data: {
        courseId,
        campusId,
        code,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError("Programme already exists", "name");
      } else if (error.code === "P2003") {
        throw new CannotProcessError("Required input is missing");
      } else {
        throw new BadRequestError("Cannot process the request");
      }
    } else {
      throw new BadRequestError("Cannot process the request");
    }
  }

  return res.json(item);
};
