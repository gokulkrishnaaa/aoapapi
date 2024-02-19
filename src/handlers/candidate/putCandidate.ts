import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { CannotProcessError } from "../../errors/cannot-process-error";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";
import { createJWT } from "../../modules/auth";

export const createCandidate = async (req, res) => {
  const data = { ...req.body };
  if (data.dob) {
    const dobstr = new Date(data.dob);
    data.dob = new Date(data.dob);
  }

  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  if (data.aadhaarverified === "") {
    delete data.aadhaarverified;
  }
  console.log(data);
  if (data.cityId === 9999999999) {
    delete data.cityId;
  } else {
    delete data.otherCity;
  }
  try {
    const candidate = await prisma.candidate.create({
      data,
    });
    return res.json(candidate);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError(
          `${error.meta.target[0]} already exists`,
          `${error.meta.target[0]}`
        );
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

export const createOrUpdateCandidate = async (req, res) => {
  const { id } = req.currentUser;
  console.log("ucrrent uere id", id);

  const data = { ...req.body };
  if (data.dob) {
    const dobstr = new Date(data.dob);
    data.dob = new Date(data.dob);
  }

  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  if (data.aadhaarverified === "") {
    delete data.aadhaarverified;
  }
  console.log(data);
  if (data.cityId === 9999999999) {
    delete data.cityId;
  } else {
    delete data.otherCity;
  }
  try {
    let candidate = null;
    if (!id) {
      candidate = await prisma.candidate.create({
        data,
      });
      await prisma.onboarding.create({
        data: {
          candidateId: candidate.id,
        },
      });
    } else {
      candidate = await prisma.candidate.update({
        where: {
          id,
        },
        data,
      });
    }
    if (!candidate) {
      throw new InternalServerError("candidate creation failed");
    }
    let user = { ...req.currentUser };
    let candidatedetails = {
      id: candidate.id,
      email: candidate.email,
      emailverified: candidate.emailverified,
      phone: candidate.phone,
      phoneverified: candidate.phoneverified,
      photoid: candidate.photoid,
    };

    user = { ...user, ...candidatedetails };

    const token = createJWT(user);

    // Store it on session object
    req.session.jwt = token;

    return res.json(candidate);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError(
          `${error.meta.target[0]} already exists`,
          `${error.meta.target[0]}`
        );
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

export const putCandidate = async (req, res) => {
  const { id } = req.currentUser;
  const data = { ...req.body };
  if (data.dob) {
    const dobstr = new Date(data.dob);
    data.dob = new Date(data.dob);
  }

  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  if (data.aadhaarverified === "") {
    delete data.aadhaarverified;
  }
  console.log(data);
  if (data.cityId === 9999999999) {
    delete data.cityId;
  } else {
    delete data.otherCity;
  }
  try {
    const candidate = await prisma.candidate.update({
      where: {
        id,
      },
      data,
    });
    return res.json(candidate);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError(
          `${error.meta.target[0]} already exists`,
          `${error.meta.target[0]}`
        );
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

export const putCandidateById = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (data.dob) {
    data.dob = new Date(data.dob);
  }

  if (data.email) {
    data.email = data.email.toLowerCase();
  }

  if (data.aadhaarverified === "") {
    delete data.aadhaarverified;
  }
  console.log(data);
  if (data.cityId === 9999999999) {
    data.cityId = null;
  } else {
    data.otherCity = "";
  }
  try {
    const candidate = await prisma.candidate.update({
      where: {
        id,
      },
      data,
    });
    return res.json(candidate);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CannotProcessError(
          `${error.meta.target[0]} already exists`,
          `${error.meta.target[0]}`
        );
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
