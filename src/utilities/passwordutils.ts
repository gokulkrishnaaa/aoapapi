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

export function generatePass() {
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 10; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}
