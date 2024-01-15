import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
// import cookieSession from "cookie-session";
import cookieSession from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import router from "./router";
import session from "express-session";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { mCurrentUser } from "./middlewares/current-user";

// Asynchronous function to establish Redis connection
async function connectRedis() {
  let redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  try {
    await redisClient.connect();
    console.log("Connected to Redis");
    return redisClient;
  } catch (error) {
    console.error("Redis connection error:", error.message);
    process.exit(1);
  }
}

// Initialize express app
const app = express();

// Call the function and continue with the setup once Redis is connected
connectRedis().then((redisClient) => {
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "aoap:",
  });

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Improved session configuration
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || "m@1ns3cr3t",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  app.use(mCurrentUser);

  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  app.use("/api", router);

  // Handling not found errors
  app.all("*", async (req, res, next) => {
    next(new NotFoundError());
  });

  // Centralized error handling middleware
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    errorHandler(err, req, res, next);
  });

  // Start the server
  app.listen(4000, () => {
    console.log("Listening on port 4000");
  });
});

export default app;
