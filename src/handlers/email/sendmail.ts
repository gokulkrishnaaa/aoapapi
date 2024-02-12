import nodemailer from "nodemailer";
import generateOtp from "../../utilities/otpgenerator";
import isValidEmail from "../../utilities/checkemail";
import prisma from "../../db";
import { render } from "@react-email/render";
import OtpMail from "../../emails/otpverify";
import OtpWelcome from "../../emails/otpwelcome";

const smtptransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "noreply@amrita.edu",
    pass: "Bot55384",
  },
});

async function sendMail(options) {
  await smtptransporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
}

export const sendEmailOtp = async (req, res) => {
  const { email: emailraw } = req.body;
  console.log("raw email", emailraw);

  const email = emailraw.toLowerCase();

  console.log("lower email", email);

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

    const existingCandiate = await prisma.candidate.findUnique({
      where: {
        email,
      },
    });

    const emailHtml = existingCandiate
      ? render(
          OtpWelcome({
            code,
            name: existingCandiate.fullname,
          })
        )
      : render(
          OtpMail({
            code,
          })
        );
    var options = {
      from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
      to: email,
      subject: "Directorate of Admissions - Amrita",
      html: emailHtml,
    };
    sendMail(options);
  } catch (error) {
    return res.json({ created: false });
  }

  return res.json({ created: true });
};
