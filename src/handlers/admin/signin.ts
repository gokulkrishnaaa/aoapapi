import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { createJWT } from "../../modules/auth";
import { createHash, verifyPassword } from "../../utilities/passwordutils";

export const adminSignin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prisma.adminUser.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    const result = await verifyPassword(password, user.password);
    if (result) {
      const userdetails = {
        username: user.username,
        role: "admin",
      };

      const token = createJWT(userdetails);

      // Store it on session object
      req.session.jwt = token;
      // 5. return the onboarding status
      res.json({ message: "success" });
    } else {
      throw new NotAuthorizedError();
    }
  } else {
    throw new NotAuthorizedError();
  }
};

export const createAdminUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prisma.adminUser.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    // create user with hash password
    const hash = await createHash(password);
    const data = {
      username,
      password: hash,
    };
    const user = await prisma.adminUser.create({
      data: {
        username,
        password: hash,
      },
    });
    return res.json({ message: `User created ${user.username}` });
  } else {
    throw new BadRequestError("Cannot create user.");
  }
};
