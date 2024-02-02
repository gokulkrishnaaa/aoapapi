import crypto from "crypto";

export const sha512 = (str) => {
  return crypto.createHash("sha512").update(str).digest("hex");
};
