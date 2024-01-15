import * as dotenv from "dotenv";
import prisma from "./db";
dotenv.config();

import app from "./server";

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error("Error: JWT_SECRET environment variable is not defined.");
    process.exit(1); // Exit with a failure code
  }

  try {
    await prisma.$connect();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }

  app.listen(4000, () => {
    console.log("Listening on port 4000");
  });
};

start().catch((error) => {
  console.error("Failed to start the server:", error.message);
  process.exit(1);
});
