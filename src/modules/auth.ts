import jwt from "jsonwebtoken";

export const createJWT = (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET);
  return token;
};
