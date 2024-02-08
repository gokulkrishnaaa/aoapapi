import prisma from "../../db";

export const createReattempt = async (req, res) => {
  const { registrationno, phaseno } = req.body;
  const registrationNo = parseInt(registrationno);
  const phaseNo = parseInt(phaseno);

  const data = {
    registrationNo: registrationNo,
    phaseno: phaseNo,
  };

  try {
    await prisma.reattempt.create({
      data,
    });

    res.status(200).json({
      time: new Date().toISOString(),
      status: 200,
      statusCode: "SUCCESS",
      message: "reattempt processed successfully",
    });
  } catch (error) {
    res.status(500).json({
      time: new Date().toISOString(),
      status: 500,
      statusCode: "FAILED",
      message: "reattempt processing failed",
    });
  }
};

export const createOrUpdateRank = async (req, res) => {
  const { registrationno, percentile } = req.body;
  const registrationNo = parseInt(registrationno);
  const percentileR = parseFloat(percentile);

  const registration = await prisma.registration.findUnique({
    where: {
      registrationNo,
    },
    include: {
      exam: true,
    },
  });

  const data = {
    registrationNo: registrationNo,
    phaseno: registration.exam.phaseno,
    percentile: percentileR,
  };

  try {
    await prisma.rank.upsert({
      where: {
        registrationNo_phaseno: {
          registrationNo: registrationNo,
          phaseno: registration.exam.phaseno,
        },
      },
      update: data,
      create: data,
    });

    res.status(200).json({
      time: new Date().toISOString(),
      status: 200,
      statusCode: "SUCCESS",
      message: "Rank processed successfully",
    });
  } catch (error) {
    res.status(500).json({
      time: new Date().toISOString(),
      status: 500,
      statusCode: "FAILED",
      message: "Rank processing failed",
    });
  }
};
