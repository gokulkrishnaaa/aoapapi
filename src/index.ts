import * as dotenv from "dotenv";
import prisma from "./db";
dotenv.config();

import app from "./server";

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }

  try {
    // await prisma.$queryRaw("SELECT 1");

    console.log("Connected to Database");
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Listening on port 4000!!!!!!!!");
  });
};
//starting
start();
