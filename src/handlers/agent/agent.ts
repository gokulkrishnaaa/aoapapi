import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { createJWT } from "../../modules/auth";
import { createHash, verifyPassword } from "../../utilities/passwordutils";
import { sendWelcomeMailAgent } from "../email/welcomeagent";

export const createAgentUser = async (req, res) => {
  const { name, username, password, email, phone, amount } = req.body;

  if (!name || !username || !password || !email || !phone || !amount) {
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
      phone,
      amount,
    };
    const user = await prisma.agent.create({
      data,
    });
    sendWelcomeMailAgent({ name, email, username, password });
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
      phone: true,
      amount: true,
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

  if (user && user.active) {
    try {
      const result = await verifyPassword(password, user.password);

      if (result) {
        const userdetails = {
          username: user.username,
          role: "agent",
          id: user.id,
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

export const getAgentDetails = async (req, res) => {
  const { username } = req.currentUser;

  const user = await prisma.agent.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      active: true,
    },
  });

  return res.json(user);
};

export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    let data = req.body;

    if (data.password) {
      const hash = await createHash(data.password);
      data = { ...data, password: hash };
    }

    const updatedAgent = await prisma.agent.update({
      where: {
        id: parseInt(id),
      },
      data,
    });
    delete updatedAgent.password;
    return res.json(updatedAgent);
  } catch (error) {
    console.log(error);

    throw new InternalServerError("Error updating agent");
  }
};

export const removeAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.agent.delete({
      where: { id: parseInt(id) },
    });
    const data = { ...deleted, password: "" };
    return res.json(data);
  } catch (error) {
    throw new InternalServerError("Error deleting agent");
  }
};
