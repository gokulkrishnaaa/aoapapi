import * as dotenv from "dotenv";
import prisma from "./db";
dotenv.config();

import bootstrapApp from "./server";

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

  try {
    const app = await bootstrapApp();
    app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
    console.log("Bootstrap successful");
  } catch (err) {
    console.error("Bootstrap Failed:", err.message);
    process.exit(1);
  }
};

start().catch((error) => {
  console.error("Failed to start the server:", error.message);
  process.exit(1);
});
