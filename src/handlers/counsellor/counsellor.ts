import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { createJWT } from "../../modules/auth";
import { createHash, verifyPassword } from "../../utilities/passwordutils";
import { sendWelcomeMailCounsellor } from "../email/welcomecounsellor";

export const createCounsellor = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email) {
    throw new BadRequestError("User cannot be created");
  }

  const userExists = await prisma.counsellor.findUnique({
    where: {
      email,
    },
  });

  console.log(userExists);

  if (!userExists) {
    // create user with hash password
    const hash = await createHash(password);
    const data = {
      name,
      email,
      password: hash,
    };
    const user = await prisma.counsellor.create({
      data,
    });
    sendWelcomeMailCounsellor({ name, email, password });
    return res.json({ message: `User created ${user.email}` });
  } else {
    throw new BadRequestError("Cannot create user.");
  }
};

export const listCounsellors = async (req, res) => {
  const counsellors = await prisma.counsellor.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json(counsellors);
};

export const removeCounsellor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.counsellor.delete({
      where: { id: parseInt(id) },
    });
    const data = { ...deleted, password: "" };
    return res.json(data);
  } catch (error) {
    throw new InternalServerError("Error deleting agent");
  }
};

export const updateCounsellor = async (req, res) => {
  try {
    const { id } = req.params;
    let data = req.body;

    if (data.password) {
      const hash = await createHash(data.password);
      data = { ...data, password: hash };
    }

    const updated = await prisma.counsellor.update({
      where: {
        id: parseInt(id),
      },
      data,
    });
    delete updated.password;
    return res.json(updated);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error updating agent");
  }
};

export const counsellorSignin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await prisma.counsellor.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    try {
      const result = await verifyPassword(password, user.password);

      if (result) {
        const userdetails = {
          email: user.email,
          role: "counsellor",
        };

        const token = createJWT(userdetails);

        // Store it on session object
        req.session.jwt = token;
        // 5. return the onboarding status
        res.json({ message: "success" });
      } else {
        throw new NotAuthorizedError();
      }
    } catch (error) {
      console.log(error);
      throw new NotAuthorizedError();
    }
  } else {
    throw new NotAuthorizedError();
  }
};

export const getCounsellorDetails = async (req, res) => {
  const { email } = req.currentUser;

  const user = await prisma.counsellor.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return res.json(user);
};
