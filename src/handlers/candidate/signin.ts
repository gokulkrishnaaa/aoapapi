import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { createJWT } from "../../modules/auth";
import isValidEmail from "../../utilities/checkemail";
import isValidPhone from "../../utilities/checkphone";

interface UTMProps {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

export const signin = async (req, res) => {
  const username = req.body.username;
  const otp = req.body.otp;
  const utm = req.body.utm;
  console.log(utm);

  // 1. verify otp
  let isValid = false;

  if (isValidEmail(username)) {
    const latestValidOTP = await prisma.emailOtp.findFirst({
      where: {
        email: username,
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
  } else if (isValidPhone(username)) {
    const latestValidOTP = await prisma.numberOtp.findFirst({
      where: {
        number: username,
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
  if (!isValid) {
    throw new BadRequestError("Invalid OTP");
  }
  // 2. check candidate
  //    a. if no candidate, create candiate and get id
  //    b. if candidate get id
  let candidate;
  candidate = await prisma.candidate.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: username,
          },
        },
        {
          phone: {
            equals: username,
          },
        },
      ],
    },
    include: {
      ExamApplication: {
        include: {
          Registration: true,
        },
      },
    },
  });

  if (candidate && candidate.agentId) {
    try {
      if (!candidate.ExamApplication[0].Registration[0]) {
        throw new BadRequestError("Login Restricted. Contact Admin");
      }
    } catch (error) {
      throw new BadRequestError("Login Restricted. Contact Admin");
    }
  }

  // 5. check onboarding status
  // 6. if no onboarding entry, create

  let onboarding = null;
  if (!candidate) {
    const candidateData = isValidEmail(username)
      ? {
          email: username,
          emailverified: new Date(),
        }
      : {
          phone: username,
          phoneverified: new Date(),
        };

    candidate = await prisma.candidate.create({
      data: candidateData,
    });

    const onboardingData = {
      candidateId: candidate.id,
    };

    if (utm) {
      await prisma.utm.create({
        data: {
          candidateId: candidate.id,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        },
      });
    }

    onboarding = await prisma.onboarding.create({
      data: onboardingData,
    });
  } else {
    onboarding = await prisma.onboarding.findUnique({
      where: {
        candidateId: candidate.id,
      },
    });
  }
  console.log(onboarding);

  // 3. create jwt with id
  // 4. add session with jwt

  const user = {
    id: candidate.id,
    email: candidate.email,
    emailverified: candidate.emailverified,
    phone: candidate.phone,
    phoneverified: candidate.phoneverified,
    photoid: candidate.photoid,
    onboarding: onboarding.current,
    onboardingstatus: onboarding.status,
    role: "candidate",
  };

  const token = createJWT(user);

  // Store it on session object
  req.session.jwt = token;
  // 5. return the onboarding status
  res.json({ onboarding });
};
