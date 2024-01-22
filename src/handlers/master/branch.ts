import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const addBranch = async (req, res) => {
  try {
    const { courseId, name, code } = req.body;

    const item = await prisma.branch.create({
      data: {
        courseId,
        name,
        code: code.toUpperCase(),
      },
    });
    return res.json(item);
  } catch (error) {
    throw new InternalServerError("Error adding Branch");
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.branch.update({
      where: { id: parseInt(id) },
      data,
    });
    return res.json(updated);
  } catch (error) {
    throw new InternalServerError("Error updating Branch");
  }
};

export const removeBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.branch.delete({
      where: { id: parseInt(id) },
    });
    return res.json(deleted);
  } catch (error) {
    throw new InternalServerError("Error deleting Branch");
  }
};

export const getBranchesFromCourse = async (req, res) => {
  const courseId = parseInt(req.params.courseid);

  if (!courseId) {
    throw new BadRequestError("Input is invalid");
  }

  try {
    const result = await prisma.branch.findMany({
      where: {
        courseId,
      },
      orderBy: {
        name: "asc", // 'asc' for ascending order, 'desc' for descending
      },
    });
    return res.json(result);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const result = await prisma.branch.findMany({
      orderBy: {
        name: "asc", // 'asc' for ascending order, 'desc' for descending
      },
    });
    return res.json(result);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  } finally {
    await prisma.$disconnect();
  }
};
