import prisma from "../../db";
import { createJWT } from "../../modules/auth";
import isValidEmail from "../../utilities/checkemail";
import isValidPhone from "../../utilities/checkphone";

export const signin = async (req, res) => {
  const username = req.body.username;
  const otp = req.body.otp;
  console.log(username);
  console.log(otp);

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
    res.status(401);
    res.json({ message: "nope" });
    return;
  }
  // 2. check candidate
  //    a. if no candidate, create candiate and get id
  //    b. if candidate get id
  let candidate = await prisma.candidate.findFirst({
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
  });

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
