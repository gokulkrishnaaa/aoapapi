import axios from "axios";
import { BadRequestError } from "../../../errors/bad-request-error";
import prisma from "../../../db";

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

    const { statusCode, StatusMessage } = data;

    console.log("statuscode", statusCode);
    console.log("statusmessage", StatusMessage);

    if (statusCode === "S001") {
      // update database
    }

    return res.json({ postData, applnDetails });
  } catch (error) {
    console.log("error.data", error.response.data);

    // update database
    const updatedRegistration = await prisma.registration.updateMany({
      where: {
        registrationNo: applnDetails.registrationNo, // Replace with the actual registration number you want to update
      },
      data: {
        centersyncstatus: false,
        centersynccomment: error.response.data.StatusMessage,
      },
    });

    throw new BadRequestError(error.response.data.StatusMessage);
  }
};

export const verifyAllCandidates = async (req, res) => {};
