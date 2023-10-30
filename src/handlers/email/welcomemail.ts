import nodemailer from "nodemailer";
import prisma from "../../db";
import { render } from "@react-email/render";
import CandidateWelcome from "../../emails/candidatewelcome";

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

export const sendWelcomeMail = async (req, res) => {
  try {
    const { id } = req.currentUser;

    const candidate = await prisma.candidate.findUnique({
      where: {
        id,
      },
    });

    const emailHtml = render(CandidateWelcome({ name: candidate.fullname }));
    var options = {
      from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
      to: candidate.email,
      subject: "Welcome to the Amrita Online Admission Portal (AOAP)",
      html: emailHtml,
    };
    sendMail(options);

    return res.json({ status: "success" });
  } catch (error) {
    return res.json({ status: "failed" });
  }
};
