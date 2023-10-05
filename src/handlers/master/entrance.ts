import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";

export const addProgrammeToEntrance = async (req, res) => {
  // check for empty string throw bad request error
  const { entranceId, programmeId } = req.body;
  if (!entranceId || !programmeId) {
    throw new BadRequestError("Input is invalid");
  }

  let item = null;
  try {
    item = await prisma.entranceProgrammes.create({
      data: {
        entranceId,
        programmeId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError(
          "Entrance already has the programme",
          "name"
        );
      } else if (error.code === "P2003") {
        throw new CannotProcessError("Required input is missing");
      } else {
        throw new BadRequestError("Cannot process the request");
      }
    } else {
      console.log(error);

      throw new BadRequestError("Cannot process the request");
    }
  }

  return res.json(item);
};

export const getProgrammesByEntrance = async (req, res) => {
  // check for empty string throw bad request error
  const entranceId = req.params.entranceId;
  const campusId = parseInt(req.query.campusid);
  const search = req.query.q;
  console.log(campusId);
  console.log(search);

  let where = {
    EntranceProgrammes: {
      some: {
        entranceId,
      },
    },
  };

  if (search) {
    where["course"] = {
      name: {
        mode: "insensitive",
        contains: search, // Search for the string inside 'course' name
      },
    };
  }

  if (!isNaN(campusId) && campusId > 0) {
    where["campusId"] = campusId;
  }

  if (!entranceId) {
    throw new BadRequestError("Entrance id is missing");
  }
  let programmes = null;
  try {
    programmes = await prisma.programmes.findMany({
      where,
      include: {
        course: true, // Include the course details
        campus: true,
      },
    });
  } catch (error) {
    console.log(error);

    throw new BadRequestError("Cannot process the request");
  }

  return res.json(programmes);
};
