import prisma from "../../db";
import isValidPhone from "../../utilities/checkphone";

export const verifyPhone = async (req, res) => {
  const { phone, otp } = req.body;

  // 1. verify otp
  let isValid = false;

  if (isValidPhone(phone)) {
    const latestValidOTP = await prisma.numberOtp.findFirst({
      where: {
        number: phone,
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
