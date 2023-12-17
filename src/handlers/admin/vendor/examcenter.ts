import axios from "axios";
import { BadRequestError } from "../../../errors/bad-request-error";
import prisma from "../../../db";
import mainqueue from "../../../queue";
import { InternalServerError } from "../../../errors/internal-server-error";

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

    const applncities = applnDetails.examapplication.ApplicationCities;

    applncities.forEach((examcity, id) => {
      const sl = id + 1;
      postData[`Preferred_CityCode_${sl}`] = `${examcity.examcity.city.id}`;
    });
  } catch (error) {
    throw new BadRequestError("Registration Not Found");
  }

  const headers = {
    TokenID: "U@TUFnhDy6gur9B4",
    "Content-Type": "application/json",
  };

  const apiUrl =
    "https://uat-pearsonvue.excelindia.com/AmritaSchedulerAPI/User/SyncUser";

  try {
    const { data } = await axios.post(apiUrl, postData, { headers });

    console.log("postData", postData);
    console.log("postData", data);

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

    return res.json({ postData, applnDetails });
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

        const applncities = applnDetails.examapplication.ApplicationCities;

        applncities.forEach((examcity, id) => {
          const sl = id + 1;
          postData[`Preferred_CityCode_${sl}`] = `${examcity.examcity.city.id}`;
        });
      } catch (error) {
        console.log("Registration Not Found");
      }

      const headers = {
        TokenID: "U@TUFnhDy6gur9B4",
        "Content-Type": "application/json",
      };

      const apiUrl =
        "https://uat-pearsonvue.excelindia.com/AmritaSchedulerAPI/User/SyncUser";

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
