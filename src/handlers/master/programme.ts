import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const createProgramme = async (req, res) => {
  // check for empty string throw bad request error
  const { branchId, campusId } = req.body;

  let branch = await prisma.branch.findUnique({
    where: {
      id: branchId,
    },
  });

  let campus = await prisma.campus.findUnique({
    where: {
      id: campusId,
    },
  });

  if (!branch || !campus) {
    throw new BadRequestError("Input is invalid");
  }

  let code = `${campus.code}${branch.code}`;
  let name = `${branch.name}, ${campus.name}`;
  try {
    const item = await prisma.programmes.create({
      data: {
        branchId,
        campusId,
        name,
        code,
      },
    });
    return res.json(item);
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
};

export const getProgrammes = async (req, res) => {
  const data = await prisma.programmes.findMany({
    include: {
      campus: true,
      branch: true,
    },
  });
  res.json(data);
};

export const searchProgrammes = async (req, res) => {
  const { searchkey, cityid } = req.body;

  const whereclause = {
    name: {
      contains: searchkey,
      mode: Prisma.QueryMode.insensitive,
    },
    campusId: 0,
  };
  if (cityid > 0) {
    whereclause.campusId = cityid;
  } else {
    delete whereclause.campusId;
  }

  const data = await prisma.programmes.findMany({
    where: whereclause,
    include: {
      campus: true,
      branch: true,
    },
  });

  res.json(data);
};

export const removeProgramme = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.programmes.delete({
      where: { id: parseInt(id) },
    });
    return res.json(deleted);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error deleting Programmes");
  }
};
