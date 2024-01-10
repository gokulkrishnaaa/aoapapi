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

const app = express();
let redisClient = createClient();
redisClient.connect().catch(console.error);

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
// app.use(
//   cookieSession({
//     store: redisStore,
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false, maxAge: 1000 * 60 * 60 },
//   })
// );
console.log("node env", process.env.NODE_ENV);

app.use(
  session({
    store: redisStore,
    secret: "keyboard cat", // Use a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 1000 * 60 * 60, // Adjust as needed
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

export default app;
