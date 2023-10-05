import nodemailer from "nodemailer";
import generateOtp from "../../utilities/otpgenerator";
import isValidEmail from "../../utilities/checkemail";
import prisma from "../../db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "heppietechie@gmail.com",
    pass: "dtqwihysdnigpmdc",
  },
});

export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.json({ created: false });
  }

  const currentDateTime = new Date();
  const expirationDateTime = new Date(currentDateTime.getTime() + 5 * 60000); // 5 minutes in milliseconds
  const code = generateOtp();
  try {
    const newEmailOTP = await prisma.emailOtp.create({
      data: {
        email,
        code,
        expiresAt: expirationDateTime, // Set the expiration time
      },
    });
    mailOtp({ email, code });
  } catch (error) {
    return res.json({ created: false });
  }

  return res.json({ created: true });
};

async function mailOtp({ email, code }) {
  var options = {
    from: "heppietechie@gmail.com ",
    to: email,
    subject: "OTP to login",
    text: `Your OTP to verify is ${code}`,
    html: `<p>Your otp to verify is ${code}</p>`,
  };
  await transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
}
