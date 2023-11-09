import nodemailer from "nodemailer";
import prisma from "../../db";
import { render } from "@react-email/render";
import CandidateWelcome from "../../emails/candidatewelcome";
import AgentWelcome from "../../emails/agentwelcome";

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

export const sendWelcomeMailAgent = async (agent) => {
  const emailHtml = render(
    AgentWelcome({
      name: agent.name,
      username: agent.username,
      password: agent.password,
    })
  );
  var options = {
    from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
    to: agent.email,
    subject: "Welcome to the Amrita Online Admission Portal (AOAP)",
    html: emailHtml,
  };
  sendMail(options);
};
