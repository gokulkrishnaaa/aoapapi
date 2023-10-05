import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";

export const createCourse = async (req, res) => {
  // check for empty string throw bad request error
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Name is invalid");
  }
  // create course
  let item = null;
  try {
    item = await prisma.course.create({
      data: {
        name,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError("Course already exists", "name");
      } else {
        throw new BadRequestError("Cannot process the request");
      }
    } else {
      throw new BadRequestError("Cannot process the request");
    }
  }
  // if faield
  return res.json(item);
};
