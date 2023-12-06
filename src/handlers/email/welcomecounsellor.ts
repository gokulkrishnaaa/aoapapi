import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import CounsellorWelcome from "../../emails/counsellorwelcome";
import CounsellorPassReset from "../../emails/cousellorpassreset";

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

export const sendWelcomeMailCounsellor = async (counsellor) => {
  const emailHtml = render(
    CounsellorWelcome({
      name: counsellor.name,
      username: counsellor.email,
      password: counsellor.password,
    })
  );
  var options = {
    from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
    to: counsellor.email,
    subject: "Welcome to the Amrita Online Admission Portal (AOAP)",
    html: emailHtml,
  };
  sendMail(options);
};

export const sendPasswordMailCounsellor = async (counsellor) => {
  const emailHtml = render(
    CounsellorPassReset({
      name: counsellor.name,
      password: counsellor.password,
    })
  );
  var options = {
    from: '"Directorate of Admissions - Amrita Vishwa Vidyapeetham" <noreply@amrita.edu>',
    to: counsellor.email,
    subject: "Your new AOAP Credentials",
    html: emailHtml,
  };
  sendMail(options);
};
