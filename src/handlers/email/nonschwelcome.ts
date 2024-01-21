import nodemailer from "nodemailer";
import prisma from "../../db";
import { render } from "@react-email/render";
import NonSchWelcome from "../../emails/nonschwelcome";

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

export const sendNonSchWelcome = async (candidate) => {
  try {
    const emailHtml = render(NonSchWelcome({ name: candidate.fullname }));
    var options = {
      from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
      to: candidate.email,
      subject: "Welcome to the Amrita Entrance Examination - Engineering 2024",
      html: emailHtml,
    };
    sendMail(options);

    return true;
  } catch (error) {
    return false;
  }
};
