import prisma from "../../db";
import { createJWT } from "../../modules/auth";

export const createCrmSignin = async (req, res) => {
  console.log("lsq body", req.body);
  const { name, email, phone, phonecode, key } = req.body;

  if (key === "f96cea198ad1dd5617ac084a3d92c6107708c0ef") {
    // 2. check candidate
    //    a. if no candidate, create candiate and get id
    //    b. if candidate get id
    let candidate = await prisma.candidate.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
          },
          {
            phone: {
              equals: phone,
            },
          },
        ],
      },
    });

    let onboarding = null;
    if (!candidate) {
      const candidateData = {
        fullname: name,
        email,
        emailverified: new Date(),
        phone,
        phoneverified: new Date(),
        phonecode,
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

    return res.redirect("/onboarding");
  } else {
    return res.redirect("/failure/crm");
  }
};
