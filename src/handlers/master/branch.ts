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
    // get all programmes with this campus id
    const programmes = await prisma.programmes.findMany({
      where: {
        branchId: parseInt(id), // Replace YOUR_CAMPUS_ID with the actual campus ID
      },
      include: {
        campus: true, // Include the related campus data
        branch: true, // Include the related branch data
      },
    });
    // iterate and upate the name
    // Iterate through each programme and update its name and code
    for (let programme of programmes) {
      const updatedProgrammeName = `${programme.branch.name}, ${programme.campus.name}`;
      const updatedProgrammeCode = `${programme.campus.code}${programme.branch.code}`;

      // Update the programme in the database
      await prisma.programmes.update({
        where: {
          id: programme.id,
        },
        data: {
          name: updatedProgrammeName,
          code: updatedProgrammeCode,
        },
      });
    }
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
