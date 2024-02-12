import axios from "axios";
import { BadRequestError } from "../../../errors/bad-request-error";
import prisma from "../../../db";
import mainqueue from "../../../queue";
import { InternalServerError } from "../../../errors/internal-server-error";
import { NotAuthorizedError } from "../../../errors/not-authorized-error";
import { sendAdmitCardMail } from "../../email/admitcardmail";
import { format } from "date-fns";
import {
  sendSlotBookBulkMail,
  sendSlotBookMail,
} from "../../email/slotbookmail";
import path from "path";
import xlsx from "xlsx";
import fs from "fs";

const apiKey = "6587ceff-28e9-44ac-8825-e26495ada87c";

export const verifyCandidateSync = async (req, res) => {
  const { regno } = req.params;

  let applnDetails;
  const postData = {
    CandidateName: "",
    Email: "",
    ApplicationNumber: "",
    ExamMode: "",
    Preferred_CityCode_1: "",
    Preferred_CityCode_2: "",
    Preferred_CityCode_3: "",
    DOB: "",
    AadharNumber: "",
    ProfilePic: "",
    CountryDialingCode: "",
    MobileNumber: "",
  };

  try {
    applnDetails = await prisma.registration.findFirst({
      where: {
        registrationNo: parseInt(regno),
      },
      include: {
        examapplication: {
          include: {
            candidate: true,
            ApplicationCities: {
              include: {
                examcity: {
                  include: {
                    city: true,
                  },
                },
              },
              orderBy: {
                id: "asc", // Sorting ApplicationCities by id in ascending order
              },
            },
          },
        },
      },
    });

    postData["CandidateName"] = applnDetails.examapplication.candidate.fullname;
    postData["Email"] = applnDetails.examapplication.candidate.email;
    postData["ApplicationNumber"] = `${applnDetails.registrationNo}`;
    postData["ExamMode"] = "SCHEDULE";
    postData["DOB"] = format(
      new Date(applnDetails.examapplication.candidate.dob),
      "yyyy-MM-dd"
    );
    postData["AadharNumber"] =
      applnDetails.examapplication.candidate.aadhaarnumber;
    postData[
      "ProfilePic"
    ] = `https://res.cloudinary.com/dkzpmdjf0/image/upload/c_fill,h_250,w_250/${applnDetails.examapplication.candidate.photoid}.jpg`;
    postData["CountryDialingCode"] =
      applnDetails.examapplication.candidate.phonecode;
    postData["MobileNumber"] = applnDetails.examapplication.candidate.phone;

    const applncities = applnDetails.examapplication.ApplicationCities;

    applncities.forEach((examcity, id) => {
      const sl = id + 1;
      postData[`Preferred_CityCode_${sl}`] = `${examcity.examcity.city.id}`;
    });
  } catch (error) {
    throw new BadRequestError("Registration Not Found");
  }

  const headers = {
    TokenID: process.env.CBT_USERSYNC_TOKEN,
    "Content-Type": "application/json",
  };

  const apiUrl = process.env.CBT_USERSYNC_URL;

  try {
    const { data } = await axios.post(apiUrl, postData, { headers });

    console.log("post Data", postData);
    console.log("return data", data);

    const { StatusCode, StatusMessage } = data;

    if (StatusCode === "S001" || StatusCode === "IA001") {
      await prisma.registration.updateMany({
        where: {
          registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
        },
        data: {
          centersyncstatus: true,
          centersynccomment: "Success",
        },
      });
    }
    if (!StatusCode || !StatusMessage) {
      await prisma.registration.updateMany({
        where: {
          registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
        },
        data: {
          centersyncstatus: false,
          centersynccomment: "Null response received",
        },
      });
    }

    return res.json({ StatusCode, StatusMessage });
  } catch (error) {
    let errorMessage = "Server Error";

    if (error.response) {
      await prisma.registration.updateMany({
        where: {
          registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
        },
        data: {
          centersyncstatus: false,
          centersynccomment: error.response.data.StatusMessage,
        },
      });
      errorMessage = error.response.data.StatusMessage;
    }

    throw new BadRequestError(errorMessage);
  }
};

export const verifyAllCandidates = async (req, res) => {
  const { examid: examId } = req.params;

  try {
    // Check if a similar job is already in the queue
    const jobs = await mainqueue.getJobs([
      "waiting",
      "active",
      "delayed",
      "paused",
    ]);

    console.log(jobs);

    const isJobAlreadyQueued = jobs.some(
      (job) => job.name === "verifyAllCandidates" && job.data.examId === examId
    );

    console.log("job already queued", isJobAlreadyQueued);

    if (isJobAlreadyQueued) {
      return res.status(400).json({
        message:
          "A verification job for this exam is already queued or in progress.",
      });
    }

    // Enqueue a single job for verifying all candidates
    await mainqueue.add("verifyAllCandidates", { examId });

    return res.json({
      message: "Verification job for all candidates enqueued",
    });
  } catch (error) {
    console.error(`Error in verifyAllCandidates: ${error.message}`);
    throw new InternalServerError("Error in verifying");
  }
};

export const verifyingAllCandidatesWorker = async (data) => {
  try {
    const { examId } = data;
    const candidates = await prisma.registration.findMany({
      where: {
        examId,
        centersyncstatus: false,
      },
      include: {
        examapplication: {
          include: {
            candidate: true,
          },
        },
      },
      orderBy: {
        registrationNo: "asc",
      },
    });

    for (const candidate of candidates) {
      const regno = candidate.registrationNo;

      let applnDetails;
      const postData = {
        CandidateName: "",
        Email: "",
        ApplicationNumber: "",
        ExamMode: "",
        Preferred_CityCode_1: "",
        Preferred_CityCode_2: "",
        Preferred_CityCode_3: "",
        DOB: "",
        AadharNumber: "",
        ProfilePic: "",
        CountryDialingCode: "",
        MobileNumber: "",
      };

      try {
        applnDetails = await prisma.registration.findFirst({
          where: {
            registrationNo: regno,
          },
          include: {
            examapplication: {
              include: {
                candidate: true,
                ApplicationCities: {
                  include: {
                    examcity: {
                      include: {
                        city: true,
                      },
                    },
                  },
                  orderBy: {
                    id: "asc", // Sorting ApplicationCities by id in ascending order
                  },
                },
              },
            },
          },
        });

        postData["CandidateName"] =
          applnDetails.examapplication.candidate.fullname;
        postData["Email"] = applnDetails.examapplication.candidate.email;
        postData["ApplicationNumber"] = `${applnDetails.registrationNo}`;
        postData["ExamMode"] = "SCHEDULE";
        postData["DOB"] = format(
          new Date(applnDetails.examapplication.candidate.dob),
          "yyyy-MM-dd"
        );
        postData["AadharNumber"] =
          applnDetails.examapplication.candidate.aadhaarnumber;
        postData[
          "ProfilePic"
        ] = `https://res.cloudinary.com/dkzpmdjf0/image/upload/c_fill,h_250,w_250/${applnDetails.examapplication.candidate.photoid}.jpg`;
        postData["CountryDialingCode"] =
          applnDetails.examapplication.candidate.phonecode;
        postData["MobileNumber"] = applnDetails.examapplication.candidate.phone;

        const applncities = applnDetails.examapplication.ApplicationCities;

        applncities.forEach((examcity, id) => {
          const sl = id + 1;
          postData[`Preferred_CityCode_${sl}`] = `${examcity.examcity.city.id}`;
        });
      } catch (error) {
        console.log("Registration Not Found");
      }

      const headers = {
        TokenID: process.env.CBT_USERSYNC_TOKEN,
        "Content-Type": "application/json",
      };

      const apiUrl = process.env.CBT_USERSYNC_URL;

      try {
        const { data } = await axios.post(apiUrl, postData, { headers });

        // console.log("postData", postData);
        // console.log("postData", data);

        const { StatusCode, StatusMessage } = data;

        if (StatusCode === "S001" || StatusCode === "IA001") {
          await prisma.registration.updateMany({
            where: {
              registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
            },
            data: {
              centersyncstatus: true,
              centersynccomment: "Success",
            },
          });
        }
        if (!StatusCode || !StatusMessage) {
          await prisma.registration.updateMany({
            where: {
              registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
            },
            data: {
              centersyncstatus: false,
              centersynccomment: "Null response received",
            },
          });
        }

        console.log("sync success");
      } catch (error) {
        let errorMessage = "Server Error";

        if (error.response) {
          await prisma.registration.updateMany({
            where: {
              registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
            },
            data: {
              centersyncstatus: false,
              centersynccomment: error.response.data.StatusMessage,
            },
          });
          errorMessage = error.response.data.StatusMessage;
        }

        console.log(errorMessage);
      }
    }

    console.log("All candidates verified");
  } catch (error) {
    console.error(
      `Error in worker processing verifyAllCandidates: ${error.message}`
    );
  }
};

export const createOrUpdateExamSlot = async (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) {
    throw new NotAuthorizedError();
  }
  const { ApplicationNumber, ExamMode, ExamDate, ExamTime, SelectedCityCode } =
    req.body;
  const registrationNo = parseInt(ApplicationNumber);

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
    examMode: ExamMode,
    examDate: new Date(ExamDate),
    examTime: ExamTime,
    selectedCityCode: SelectedCityCode,
  };

  try {
    await prisma.slot.upsert({
      where: {
        registrationNo_phaseno: {
          registrationNo: registrationNo,
          phaseno: registration.exam.phaseno,
        },
      },
      update: data,
      create: data,
    });

    sendSlotBookMail(registrationNo);

    res.status(200).json({
      time: new Date().toISOString(),
      status: 200,
      statusCode: "SUCCESS",
      message: "Slot processed successfully",
    });
  } catch (error) {
    res.status(500).json({
      time: new Date().toISOString(),
      status: 500,
      statusCode: "FAILED",
      message: "Slot processing failed",
    });
  }
};

export const createOrUpdateAdmitCard = async (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) {
    throw new NotAuthorizedError();
  }
  const {
    ApplicationNumber,
    ExamMode,
    LocationName,
    ExamDate,
    ExamTime,
    LocationAddress,
    Pincode,
    QRcode,
    PhoneNumber,
  } = req.body;
  const registrationNo = parseInt(ApplicationNumber);

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
    examMode: ExamMode,
    locationName: LocationName,
    examDate: new Date(ExamDate),
    examTime: ExamTime,
    locationAddress: LocationAddress,
    pincode: Pincode,
    qrcode: QRcode,
    phoneNumber: PhoneNumber,
  };

  try {
    await prisma.admitCard.upsert({
      where: {
        registrationNo_phaseno: {
          registrationNo: registrationNo,
          phaseno: registration.exam.phaseno,
        },
      },
      update: data,
      create: data,
    });

    sendAdmitCardMail(registrationNo);

    res.status(200).json({
      time: new Date().toISOString(),
      status: 200,
      statusCode: "SUCCESS",
      message: "Successfully updated exam location information",
    });
  } catch (error) {
    res.status(500).json({
      time: new Date().toISOString(),
      status: 500,
      statusCode: "FAILED",
      message: "Exam location processing failed",
    });
  }
};

export const handleRankUpload = async (req, res) => {
  if (req.headers["x-api-key"] !== apiKey) {
    throw new NotAuthorizedError();
  }
  const { examId } = req.body;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
  });

  if (!exam) {
    throw new BadRequestError("Exam does not exist");
  }

  let uploadedFile = req.files.file;
  let uploadbasefolder = "./uploads/";

  // Extract the file extension from the uploaded file
  let fileExtension = path.extname(uploadedFile.name);
  // Ensure the file extension is in the expected format (.xls, .xlsx, .csv, etc.)
  if (![".xlsx"].includes(fileExtension.toLowerCase())) {
    return res.status(400).send("Invalid file format.");
  }

  let uploadfilename = `rank_${Date.now()}${fileExtension}`; // Use the extracted file extension

  let uploadfilepath = `${uploadbasefolder}${uploadfilename}`;
  // Use the mv() method to place the file in upload directory
  uploadedFile.mv(uploadfilepath, async function (err) {
    if (err) return res.status(500).send(err);
    try {
      // Check if a similar job is already in the queue
      const jobs = await mainqueue.getJobs([
        "waiting",
        "active",
        "delayed",
        "paused",
      ]);

      console.log(jobs);

      const isJobAlreadyQueued = jobs.some(
        (job) =>
          job.name === "storeAeeeRankWorker" && job.data.file === uploadfilepath
      );

      console.log("job already queued", isJobAlreadyQueued);

      if (isJobAlreadyQueued) {
        return res.status(400).json({
          message:
            "A rank import job for this exam is already queued or in progress.",
        });
      }

      // Enqueue a single job for verifying all candidates
      await mainqueue.add("storeAeeeRankWorker", {
        file: uploadfilepath,
        exam,
      });

      return res.json({
        message: "Rank import job for exam enqueued",
      });
    } catch (error) {
      console.error(`Error in rank import: ${error.message}`);
      throw new InternalServerError("Error in Rank Import");
    }
  });
};

export const pollRankImport = async (req, res) => {
  const { examId, phaseno } = req.body;

  const record = await prisma.rankImport.findFirst({
    where: {
      examId,
      phaseno,
    },
  });

  res.status(200).json(record);
};

export const publishAeeeRank = async (req, res) => {
  const { examId } = req.body;
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
  });

  const rankimport = await prisma.rankImport.findFirst({
    where: {
      examId,
      phaseno: exam.phaseno,
    },
  });

  if (!rankimport) {
    throw new InternalServerError("Rank Not imported");
  }

  if (rankimport.status != "SUCCESS") {
    throw new InternalServerError("Rank Import not completed");
  }

  const data = {
    phaseno: exam.phaseno + 1,
    slotstatus: false,
    rankpublish: true,
  };

  await prisma.exam.update({
    where: {
      id: examId,
    },
    data,
  });

  res.status(200).json("published");
};

export const storeAeeeRankWorker = async (data) => {
  const { file, exam } = data;

  const phaseno = exam.phaseno;
  await prisma.rankImport.upsert({
    where: {
      examId_phaseno: {
        examId: exam.id,
        phaseno: phaseno,
      },
    },
    update: { status: "STARTED" },
    create: {
      examId: exam.id, // This should match the examId used in the `where` clause
      phaseno: phaseno,
      status: "STARTED",
    },
  });

  try {
    const workbook = xlsx.readFile(file);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rankdata = xlsx.utils.sheet_to_json(sheet);

    for (const row of rankdata) {
      const data = {
        registrationNo: row["RegNo"],
        phaseno,
        percentile: parseFloat(row["Percentile"].toFixed(7)),
      };
      try {
        await prisma.rank.upsert({
          where: {
            registrationNo_phaseno: {
              registrationNo: data.registrationNo,
              phaseno,
            },
          },
          update: data,
          create: data,
        });
        console.log("success", data);
      } catch (error) {
        console.log("error", data);
        throw error;
      }
    }
    await prisma.rankImport.update({
      where: {
        examId_phaseno: {
          examId: exam.id, // Make sure to provide the examId variable
          phaseno: phaseno,
        },
      },
      data: { status: "SUCCESS" },
    });
    fs.unlinkSync(file);
  } catch (error) {
    fs.unlinkSync(file);
    await prisma.rankImport.update({
      where: {
        examId_phaseno: {
          examId: exam.id, // Make sure to provide the examId variable
          phaseno: phaseno,
        },
      },
      data: { status: "FAILED" },
    });
    console.log("import failed");
  }
};

export const sendSlotMailBulk = async (req, res) => {
  const exam = await getActiveExamByCode("AEEE");
  if (exam) {
    const { id: examId } = exam;

    try {
      // Check if a similar job is already in the queue
      const jobs = await mainqueue.getJobs([
        "waiting",
        "active",
        "delayed",
        "paused",
      ]);

      console.log(jobs);

      const isJobAlreadyQueued = jobs.some(
        (job) => job.name === "sendSlotMailBulk" && job.data.exam.id === examId
      );

      console.log("job already queued", isJobAlreadyQueued);

      if (isJobAlreadyQueued) {
        return res.status(400).json({
          message:
            "A sending job for this exam is already queued or in progress.",
        });
      }

      // Enqueue a single job for verifying all candidates
      await mainqueue.add("sendSlotMailBulk", { exam });

      return res.json({
        message: "Sending Slot Mail for all candidates enqueued",
      });
    } catch (error) {
      console.error(`Error in sendSlotMailBulk: ${error.message}`);
      throw new InternalServerError("Error in sending");
    }
  }

  return res.json({ message: "Job Done" });
};

export const sendingSlotBulkMail = async (data) => {
  try {
    const { exam } = data;
    const registrations = await prisma.registration.findMany({
      where: {
        examId: exam.id,
        centersyncstatus: true,
        SlotMailStatus: null,
        createdAt: {
          lte: new Date(exam.phaseenddate),
        },
      },
      include: {
        examapplication: {
          include: {
            candidate: true,
          },
        },
        SlotMailStatus: true, // Include SlotMailStatus data
      },
      orderBy: {
        registrationNo: "asc",
      },
    });

    for (const registration of registrations) {
      try {
        await sendSlotBookBulkMail(registration.examapplication.candidate);
        const slotMailStatus = await prisma.slotMailStatus.create({
          data: {
            registrationId: registration.id,
          },
        });
        console.log(
          "Mail Sent : ",
          registration.examapplication.candidate.email
        );
      } catch (error) {
        console.log(
          "Mail Sent Failed: ",
          registration.examapplication.candidate.email
        );
      }
    }
    console.log("All slot mail sent");
  } catch (error) {
    console.error(
      `Error in worker processing sendingSlotBulkMail: ${error.message}`
    );
  }
};

async function getActiveExamByCode(code) {
  return await prisma.exam.findFirst({
    where: {
      entrance: {
        code,
      },
    },
    include: {
      entrance: true,
    },
  });
}
