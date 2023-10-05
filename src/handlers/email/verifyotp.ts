import prisma from "../../db";
import isValidEmail from "../../utilities/checkemail";

export const verifyEmail = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  console.log(email);
  console.log(otp);

  // 1. verify otp
  let isValid = false;

  if (isValidEmail(email)) {
    const latestValidOTP = await prisma.emailOtp.findFirst({
      where: {
        email,
        expiresAt: {
          gt: new Date(), // Check if the expiration date is greater than the current date and time
        },
      },
      orderBy: {
        expiresAt: "desc", // Order by expiration date in ascending order to get the latest OTP
      },
    });

    if (latestValidOTP) {
      if (latestValidOTP.code === otp) {
        isValid = true;
      }
    }
  }

  return res.json({ isValid });
};
