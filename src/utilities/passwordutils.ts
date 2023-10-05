import bcrypt from "bcrypt";
const saltrounds = 10;

export async function createHash(input) {
  try {
    const hash = await bcrypt.hash(input, saltrounds);
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function verifyPassword(password, hash) {
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
