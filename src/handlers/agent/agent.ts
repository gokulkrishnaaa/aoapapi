import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { createJWT } from "../../modules/auth";
import { createHash, verifyPassword } from "../../utilities/passwordutils";

export const createAgentUser = async (req, res) => {
  const { name, username, password, email } = req.body;

  if (!name || !username || !password || !email) {
    throw new BadRequestError("User cannot be created");
  }

  const userExists = await prisma.agent.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  console.log(userExists);

  if (!userExists) {
    // create user with hash password
    const hash = await createHash(password);
    const data = {
      name,
      email,
      username,
      password: hash,
    };
    const user = await prisma.agent.create({
      data,
    });
    return res.json({ message: `User created ${user.username}` });
  } else {
    throw new BadRequestError("Cannot create user.");
  }
};

export const listAgents = async (req, res) => {
  const agents = await prisma.agent.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      active: true,
      createdAt: true,
    },
  });

  return res.json(agents);
};

export const agentSignin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await prisma.agent.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    try {
      const result = await verifyPassword(password, user.password);

      if (result) {
        const userdetails = {
          username: user.username,
          role: "agent",
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
