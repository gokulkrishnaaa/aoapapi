import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const addProgrammeToEntrance = async (req, res) => {
  // check for empty string throw bad request error
  const { entranceId, programmeId } = req.body;
  console.log("entranceid", entranceId);
  console.log("programmeId", programmeId);

  if (!entranceId || !programmeId) {
    throw new BadRequestError("Input is invalid");
  }

  let item = null;
  try {
    item = await prisma.entranceProgrammes.create({
      data: {
        entranceId,
        programmeId: parseInt(programmeId),
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

export const removeEntranceFromProgram = async (req, res) => {
  const { entranceId, programmeId } = req.params;
  try {
    const deletedEntranceProgramme = await prisma.entranceProgrammes.delete({
      where: {
        entranceId_programmeId: {
          entranceId,
          programmeId: parseInt(programmeId),
        },
      },
    });

    return res.json(deletedEntranceProgramme);
  } catch (error) {
    throw new InternalServerError("Error removing entrance programme");
  }
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
        campus: true,
      },
    });
  } catch (error) {
    console.log(error);

    throw new BadRequestError("Cannot process the request");
  }

  return res.json(programmes);
};
