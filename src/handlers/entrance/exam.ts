import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";

export const createExam = async (req, res) => {
  const data = req.body;

  const exam = await prisma.exam.create({
    data,
  });

  console.log(exam);

  return res.json(exam);
};

export const getOpenExams = async (req, res) => {
  const latestExamsByEntrance = await prisma.entrance.findMany({
    include: {
      Exam: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  const filteredEntrances = latestExamsByEntrance.filter((entrance) => {
    const allowedStatus = ["APPLY", "SLOT"];
    return allowedStatus.includes(entrance.Exam[0].status);
  });

  return res.json(filteredEntrances);
};

export const checkExamValid = async (req, res) => {
  const id = req.params.id;
  const input = req.body;
  console.log(input);
  const lastExamWithEntranceCode = await prisma.exam.findFirst({
    where: {
      entrance: {
        code: input.code,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (
    !lastExamWithEntranceCode ||
    lastExamWithEntranceCode.id != id ||
    !isOpenForApplication(lastExamWithEntranceCode)
  ) {
    return res.json({ valid: false });
  }

  return res.json({ valid: true });
};

function isOpenForApplication(exam) {
  return exam.status === "APPLY";
}

export const getAllExams = async (req, res) => {
  const allexams = await prisma.exam.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(allexams);
};

export const getExamsByEntrance = async (req, res) => {
  const { entranceId } = req.params;
  const allexams = await prisma.exam.findMany({
    where: {
      entranceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.json(allexams);
};

export const updateExam = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const updatedExam = await prisma.exam.update({
    where: {
      id,
    },
    data,
  });

  return res.json(updatedExam);
};

export const registerForExam = async (req, res) => {
  const { examId, examapplicationId } = req.body;

  const successPayment = await prisma.entrancePayments.findMany({
    where: {
      examapplicationId, // Replace with the actual application ID you want to filter by
      status: "SUCCESS",
    },
  });

  if (successPayment.length === 0) {
    throw new BadRequestError("Payment Pending");
  }

  const lastEntry = await prisma.registration.findFirst({
    where: { examId },
    orderBy: { id: "desc" },
  });

  let registrationNo = 1000001;

  if (lastEntry) {
    const lastRegNo = lastEntry.registrationNo;
    registrationNo = lastRegNo + 1;
  }

  try {
    const registration = await prisma.registration.create({
      data: {
        examId,
        examapplicationId,
        registrationNo,
      },
    });
    return res.json(registration);
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Registration Failed. Please try again");
  }
};

export const examPaymentSuccess = async (req, res) => {
  const { txnid, result } = req.body;

  const transactionDetails = await prisma.entrancePayments.findUnique({
    where: {
      txnid,
    },
    include: {
      examapplication: {
        include: {
          exam: {
            include: {
              entrance: true,
            },
          },
        },
      },
    },
  });

  let txnstatus =
    result === "success"
      ? "SUCCESS"
      : result === "failed"
      ? "FAILED"
      : transactionDetails.status;

  const updatedTransaction = await prisma.entrancePayments.update({
    where: {
      txnid,
    },
    data: {
      status: txnstatus,
    },
  });

  if (updatedTransaction.status === "SUCCESS") {
    const lastEntry = await prisma.registration.findFirst({
      where: { examId: transactionDetails.examapplication.exam.id },
      orderBy: { id: "desc" },
    });

    let registrationNo = 1000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    try {
      const registration = await prisma.registration.create({
        data: {
          examId: transactionDetails.examapplication.exam.id,
          examapplicationId: transactionDetails.examapplication.id,
          registrationNo,
        },
      });
      console.log(registration);
    } catch (error) {
      console.log(error);
    }
  }
  res.redirect("/applications");
};
