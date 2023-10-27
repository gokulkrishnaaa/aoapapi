import nodemailer from "nodemailer";
import generateOtp from "../../utilities/otpgenerator";
import isValidEmail from "../../utilities/checkemail";
import prisma from "../../db";

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

const smtptransporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "noreply@amrita.edu",
    pass: "Bot55384",
  },
});

async function mailOtp({ email, code }) {
  var options = {
    from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
    to: email,
    subject: "Directorate of Admissions - Amrita",
    text: `Your OTP to verify is ${code}`,
    html: `
    <div style="text-align: center;">
      <p style="margin: 20px; font-family: 'Arial', sans-serif;">Congratulations for showing interest in the undergraduate programmes offered by Amrita Vishwa Vidyapeetham.</p>
      <p style="font-family: 'Arial', sans-serif;">Your OTP to verify is <span style="font-weight: bold">${code}</span>.</p>
      <p style="font-family: 'Arial', sans-serif; font-style:italic"><span style="color: red;">*</span> OTP is valid only for 3 minutes</p>
    </div>
  `,
  };
  await smtptransporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
}
