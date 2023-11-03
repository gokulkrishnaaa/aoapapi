import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const addReferer = async (req, res) => {
  // check for empty string throw bad request error
  const { url } = req.body;

  if (url) {
    try {
      const item = await prisma.referer.create({
        data: {
          url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return res.json("completed");
};
