import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
// import cookieSession from "cookie-session";
import cookieSession from "express-session";
import RedisStore from "connect-redis";
import { createClient, createCluster } from "redis";
import router from "./router";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { mCurrentUser } from "./middlewares/current-user";

const bootstrapApp = async () => {
  const app = express();

  //   let redisClient = createClient({
  //     url: process.env.REDIS_URL,
  //   });

  console.log(process.env.REDIS_URL);

  let redisClient = createCluster({
    rootNodes: [
      {
        url: process.env.REDIS_URL,
      },
    ],
    // You may need additional cluster-specific options here
  });

  await redisClient.connect();

  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "aoap:",
  });

  app.set("trust proxy", 1);

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cookieSession({
      store: redisStore,
      secret: process.env.SESSION_SECRET || "gr3@ts3cr3t",
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

  app.all("*", async (req, res) => {
    throw new NotFoundError();
  });

  app.use(errorHandler);

  return app;
};

export default bootstrapApp;
