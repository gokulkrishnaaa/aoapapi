import prisma from "../../db";

export const getNumberOtp = async (req, res) => {
  const { input: number } = req.body;

  const code = await prisma.numberOtp.findFirst({
    where: {
      number,
    },
    orderBy: {
      id: "desc",
    },
  });

  return res.json({ code: code ? code.code : "" });
};

export const getEmailOtp = async (req, res) => {
  const { input: email } = req.body;

  const code = await prisma.emailOtp.findFirst({
    where: {
      email,
    },
    orderBy: {
      id: "desc",
    },
  });

  return res.json({ code: code ? code.code : "" });
};
