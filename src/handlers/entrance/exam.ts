import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { InternalServerError } from "../../errors/internal-server-error";
import crypto from "crypto";
import { entranceWelcome } from "../email";
import { entranceWelcomeAgent } from "../email/entrancewelcome";
import { logTransaction } from "../utils/transactions";
import { invokepaymentAPI } from "../leadsquared/paymentapirequest";

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
    const allowedStatus = ["PAUSE", "CLOSED"];
    return !allowedStatus.includes(entrance.Exam[0].status);
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
  return exam.status != "PAUSE" || "CLOSED";
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

export const getExamByEntrance = async (req, res) => {
  const { id } = req.params;
  const firstExam = await prisma.exam.findFirst({
    where: {
      entranceId: id, // Replace with the actual entranceId you're interested in
      status: {
        not: "CLOSED",
      },
    },
    include: {
      RankImport: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(firstExam);
};

export const updateExam = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  if (data.phaseenddate) {
    data.phaseenddate = new Date(data.phaseenddate);
  }

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

  const successPayment = await prisma.entrancePayments.findFirst({
    where: {
      examapplicationId,
      status: "SUCCESS",
    },
    include: {
      examapplication: {
        include: {
          exam: true,
        },
      },
    },
  });

  if (!successPayment) {
    throw new BadRequestError("Payment Pending");
  }

  if (successPayment.type == "AGENT") {
    const lastEntry = await prisma.registration.findFirst({
      where: {
        examId: successPayment.examapplication.exam.id,
        type: "AGENT",
      },
      orderBy: { id: "desc" },
    });
    let registrationNo = 5000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    entranceWelcomeAgent(successPayment.candidateId, registrationNo);
    try {
      await prisma.registration.create({
        data: {
          examId: successPayment.examapplication.exam.id,
          examapplicationId: successPayment.examapplication.id,
          registrationNo,
          type: "AGENT",
          createdAt: successPayment.createdAt,
        },
      });
      await prisma.examApplication.update({
        where: {
          id: successPayment.examapplication.id,
        },
        data: {
          status: "REGISTERED",
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Registration Unsuccessful");
    }
  } else if (successPayment.type == "ONLINE") {
    const lastEntry = await prisma.registration.findFirst({
      where: {
        examId: successPayment.examapplication.exam.id,
        type: "ONLINE",
      },
      orderBy: { id: "desc" },
    });

    let registrationNo = 1000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    entranceWelcome(successPayment.candidateId);

    try {
      await prisma.registration.create({
        data: {
          examId: successPayment.examapplication.exam.id,
          examapplicationId: successPayment.examapplication.id,
          registrationNo,
          createdAt: successPayment.createdAt,
        },
      });
      await prisma.examApplication.update({
        where: {
          id: successPayment.examapplication.id,
        },
        data: {
          status: "REGISTERED",
        },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Registration Unsuccessful");
    }
  }

  return res.json({ message: "done" });
};


export const makeCandidatePaid = async (req, res) => {
  const { examId, examapplicationId,candidateId } = req.body;  

    const lastEntry = await prisma.registration.findFirst({
      where: {
        examId: examapplicationId,
        type: "ONLINE",
      },
      orderBy: { id: "desc" },
    });

    let registrationNo = 1000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    entranceWelcome(candidateId);

    try {
      await prisma.registration.create({
        data: {
          examId: examapplicationId,
          examapplicationId: examapplicationId,
          registrationNo,    
        },
      });
      await prisma.examApplication.update({
        where: {
          id: examapplicationId,
        },
        data: {
          status: "REGISTERED",
        },
      });
      
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Make as Payment Unsuccessful");
    } 

  return res.json({ message: "done" });
};

export const registerForExamReattempt = async (req, res) => {
  const { examapplicationId } = req.body;

  const successPayment = await prisma.entrancePayments.findFirst({
    where: {
      examapplicationId,
      status: "SUCCESS",
      reattempt: true,
    },
    include: {
      examapplication: {
        include: {
          Registration: true,
        },
      },
    },
  });

  if (!successPayment) {
    throw new BadRequestError("Payment Pending");
  }

  try {
    await prisma.reattempt.create({
      data: {
        registrationNo:
          successPayment.examapplication.Registration[0].registrationNo,
      },
    });
  } catch (error) {
    throw new InternalServerError("Reattempt Failed");
  }

  return res.json({ message: "done" });
};

export const examPaymentSuccess = async (req, res) => {
  const { txnid } = req.body;

  // production details
  //   const key = "ypfBaj";
  //   const salt = "aG3tGzBZ";
  //   const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

  // enviornment details
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const chkUrl = process.env.PAYU_CHKURL;

  //development details
  //   const key = "aJ1WVm";
  //   const salt = "hKmYSMBAzg5QOw64IV9MFtcu6BKaIyYA";
  //   const chkUrl = "https://test.payu.in/merchant/postservice?form=2";

  const command = "verify_payment";

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

  const chkHeaders = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const hashString = `${key}|${command}|${txnid}|${salt}`;

  const hash = sha512(hashString);

  const formData = new URLSearchParams();
  formData.append("key", key);
  formData.append("command", "verify_payment");
  formData.append("var1", txnid);
  formData.append("hash", hash);

  console.log(formData);

  const chkResponse = await fetch(chkUrl, {
    method: "POST",
    headers: chkHeaders,
    body: formData,
  });
  const chkResponseData = await chkResponse.json();
  if ((chkResponseData as { status: number }).status === 0) {
    return res.redirect("/applications/payment/failure");
  }

  // get all details and ssave to db

  let txnstatus =
    (chkResponseData as any).transaction_details[txnid].status === "success"
      ? "SUCCESS"
      : (chkResponseData as any).transaction_details[txnid].status === "failure"
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
      where: {
        examId: transactionDetails.examapplication.exam.id,
        type: "ONLINE",
      },
      orderBy: { id: "desc" },
    });

    let registrationNo = 1000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: updatedTransaction.candidateId,
      },
    });

    const candid = candidate.id;
    const uname = candidate.fullname;
    let uphone = candidate.phone;
    let email = candidate.email;
    let source = "";
    const section = "App Fee Payment";
    const paystatus = "Paid";
    invokepaymentAPI(
      {
        email: email,
        name: uname,
        phone: uphone,
        section: section,
        paystatus: paystatus,
        source: source,
        candid: candid,
      },
      res
    );

    entranceWelcome(updatedTransaction.candidateId);

    try {
      const registration = await prisma.registration.create({
        data: {
          examId: transactionDetails.examapplication.exam.id,
          examapplicationId: transactionDetails.examapplication.id,
          registrationNo,
        },
      });
      await prisma.examApplication.update({
        where: {
          id: transactionDetails.examapplication.id,
        },
        data: {
          status: "REGISTERED",
        },
      });
      await logTransaction(txnid, chkResponseData);
      return res.redirect("/applications/payment/success");
    } catch (error) {
      console.log(error);
      return res.redirect("/applications/payment/success");
    }
  }
  return res.redirect("/applications/payment/failure");
};

export const examReattemptPaymentSuccess = async (req, res) => {
  const { txnid } = req.body;

  // enviornment details
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const chkUrl = process.env.PAYU_CHKURL;

  const command = "verify_payment";

  const transactionDetails = await prisma.entrancePayments.findUnique({
    where: {
      txnid,
    },
    include: {
      examapplication: {
        include: {
          Registration: true,
        },
      },
    },
  });

  const chkHeaders = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const hashString = `${key}|${command}|${txnid}|${salt}`;

  const hash = sha512(hashString);

  const formData = new URLSearchParams();
  formData.append("key", key);
  formData.append("command", "verify_payment");
  formData.append("var1", txnid);
  formData.append("hash", hash);

  console.log(formData);

  const chkResponse = await fetch(chkUrl, {
    method: "POST",
    headers: chkHeaders,
    body: formData,
  });
  const chkResponseData = await chkResponse.json();
  if ((chkResponseData as { status: number }).status === 0) {
    return res.redirect("/applications/payment/failure");
  }

  // get all details and ssave to db

  let txnstatus =
    (chkResponseData as any).transaction_details[txnid].status === "success"
      ? "SUCCESS"
      : (chkResponseData as any).transaction_details[txnid].status === "failure"
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
    try {
      await prisma.reattempt.create({
        data: {
          registrationNo:
            transactionDetails.examapplication.Registration[0].registrationNo,
        },
      });
      await logTransaction(txnid, chkResponseData);
      return res.redirect("/applications/payment/success");
    } catch (error) {
      console.log(error);
      return res.redirect("/applications/payment/success");
    }
  }
  return res.redirect("/applications/payment/failure");
};

export const examPaymentFailure = async (req, res) => {
  console.log("payment Failure");
  console.log(req.body);
  const { txnid } = req.body;

  const updatedTransaction = await prisma.entrancePayments.update({
    where: {
      txnid,
    },
    data: {
      status: "FAILED",
    },
  });
  return res.redirect("/applications/payment/failure");
};

export const examReattemptPaymentFailure = async (req, res) => {
  console.log("payment Failure");
  console.log(req.body);
  const { txnid } = req.body;

  const updatedTransaction = await prisma.entrancePayments.update({
    where: {
      txnid,
    },
    data: {
      status: "FAILED",
    },
  });
  return res.redirect("/applications/payment/failure");
};

export const examAgentPaymentSuccess = async (req, res) => {
  console.log("payment success");
  console.log(req.body);
  const { txnid, udf1: applnno } = req.body;

  // production details
  //   const key = "ypfBaj";
  //   const salt = "aG3tGzBZ";
  //   const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const chkUrl = process.env.PAYU_CHKURL;

  //development details
  //   const key = "aJ1WVm";
  //   const salt = "hKmYSMBAzg5QOw64IV9MFtcu6BKaIyYA";
  //   const chkUrl = "https://test.payu.in/merchant/postservice?form=2";

  const command = "verify_payment";

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

  const chkHeaders = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const hashString = `${key}|${command}|${txnid}|${salt}`;

  const hash = sha512(hashString);

  const formData = new URLSearchParams();
  formData.append("key", key);
  formData.append("command", "verify_payment");
  formData.append("var1", txnid);
  formData.append("hash", hash);

  console.log(formData);

  const chkResponse = await fetch(chkUrl, {
    method: "POST",
    headers: chkHeaders,
    body: formData,
  });
  const chkResponseData = await chkResponse.json();
  if ((chkResponseData as { status: number }).status === 0) {
    return res.redirect(`/agent/candidate/payment/${applnno}/failure`);
  }

  // get all details and ssave to db

  let txnstatus =
    (chkResponseData as any).transaction_details[txnid].status === "success"
      ? "SUCCESS"
      : (chkResponseData as any).transaction_details[txnid].status === "failure"
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
      where: {
        examId: transactionDetails.examapplication.exam.id,
        type: "AGENT",
      },
      orderBy: { id: "desc" },
    });
    let registrationNo = 5000001;

    if (lastEntry) {
      const lastRegNo = lastEntry.registrationNo;
      registrationNo = lastRegNo + 1;
    }

    entranceWelcomeAgent(updatedTransaction.candidateId, registrationNo);
    try {
      await prisma.registration.create({
        data: {
          examId: transactionDetails.examapplication.exam.id,
          examapplicationId: transactionDetails.examapplication.id,
          registrationNo,
          type: "AGENT",
        },
      });
      await prisma.examApplication.update({
        where: {
          id: transactionDetails.examapplication.id,
        },
        data: {
          status: "REGISTERED",
        },
      });
      await logTransaction(txnid, chkResponseData);
      return res.redirect(`/agent/candidate/payment/${applnno}/success`);
    } catch (error) {
      console.log(error);
      return res.redirect(`/agent/candidate/payment/${applnno}/success`);
    }
  }

  return res.redirect(`/agent/candidate/payment/${applnno}/failure`);
};

export const examAgentPaymentFailure = async (req, res) => {
  console.log("payment Failure");
  console.log(req.body);
  const { txnid, udf1: applnno } = req.body;

  console.log("failure txn", req.body);

  const updatedTransaction = await prisma.entrancePayments.update({
    where: {
      txnid,
    },
    data: {
      status: "FAILED",
    },
  });
  return res.redirect(`/agent/candidate/payment/${applnno}/failure`);
};

export const verifyTransaction = async (req, res) => {
  console.log("verifyTransaction");
  const { txnid } = req.body;

  // production details
  //   const key = "ypfBaj";
  //   const salt = "aG3tGzBZ";
  //   const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const chkUrl = process.env.PAYU_CHKURL;

  //development details
  //   const key = "aJ1WVm";
  //   const salt = "hKmYSMBAzg5QOw64IV9MFtcu6BKaIyYA";
  //   const chkUrl = "https://test.payu.in/merchant/postservice?form=2";

  const command = "verify_payment";

  const transactionDetails = await prisma.entrancePayments.findUnique({
    where: {
      txnid,
    },
  });

  if (!transactionDetails) {
    throw new BadRequestError("Transaction not found");
  }

  const chkHeaders = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const hashString = `${key}|${command}|${txnid}|${salt}`;

  const hash = sha512(hashString);

  const formData = new URLSearchParams();
  formData.append("key", key);
  formData.append("command", "verify_payment");
  formData.append("var1", txnid);
  formData.append("hash", hash);

  const chkResponse = await fetch(chkUrl, {
    method: "POST",
    headers: chkHeaders,
    body: formData,
  });
  const chkResponseData = await chkResponse.json();

  // get all details and ssave to db

  const fetchedStatus = chkResponseData["status"];

  console.log("fetched status", fetchedStatus);

  if (fetchedStatus) {
    let txndetails = (chkResponseData as any).transaction_details[txnid];
    if (txndetails) {
      let txnstatus =
        txndetails.status === "success"
          ? "SUCCESS"
          : txndetails.status === "failure"
          ? "FAILED"
          : transactionDetails.status;

      if (txnstatus != transactionDetails.status) {
        await prisma.entrancePayments.update({
          where: {
            txnid,
          },
          data: { status: txnstatus },
        });
      }
      await logTransaction(txnid, chkResponseData);
    }
  }
  return res.json({ chkResponseData });
};

export const verifyJeeTransaction = async (req, res) => {
  const { txnid } = req.body;

  // production details
  //   const key = "ypfBaj";
  //   const salt = "aG3tGzBZ";
  //   const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;
  const chkUrl = process.env.PAYU_CHKURL;

  //development details
  //   const key = "aJ1WVm";
  //   const salt = "hKmYSMBAzg5QOw64IV9MFtcu6BKaIyYA";
  //   const chkUrl = "https://test.payu.in/merchant/postservice?form=2";

  const command = "verify_payment";

  const transactionDetails = await prisma.jEEPayments.findUnique({
    where: {
      txnid,
    },
  });

  if (!transactionDetails) {
    throw new BadRequestError("Transaction not found");
  }

  const chkHeaders = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const hashString = `${key}|${command}|${txnid}|${salt}`;

  const hash = sha512(hashString);

  const formData = new URLSearchParams();
  formData.append("key", key);
  formData.append("command", "verify_payment");
  formData.append("var1", txnid);
  formData.append("hash", hash);

  const chkResponse = await fetch(chkUrl, {
    method: "POST",
    headers: chkHeaders,
    body: formData,
  });
  const chkResponseData = await chkResponse.json();

  // get all details and ssave to db

  const fetchedStatus = chkResponseData["status"];

  console.log("fetched status", fetchedStatus);

  if (fetchedStatus) {
    let txndetails = (chkResponseData as any).transaction_details[txnid];
    if (txndetails) {
      let txnstatus =
        txndetails.status === "success"
          ? "SUCCESS"
          : txndetails.status === "failure"
          ? "FAILED"
          : transactionDetails.status;

      if (txnstatus != transactionDetails.status) {
        await prisma.jEEPayments.update({
          where: {
            txnid,
          },
          data: { status: txnstatus },
        });
      }
      await logTransaction(txnid, chkResponseData);
    }
  }

  return res.json({ chkResponseData });
};

function sha512(str) {
  return crypto.createHash("sha512").update(str).digest("hex");
}
