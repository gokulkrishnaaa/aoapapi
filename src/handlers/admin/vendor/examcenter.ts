import axios from "axios";
import { BadRequestError } from "../../../errors/bad-request-error";

export const verifyCandidateSync = async (req, res) => {
  const postData = {
    CandidateName: "Shankar",
    Email: "shankar@gmail.com",
    ApplicationNumber: "1000000003",
    ExamMode: "SCHEDULE",
    Preferred_CityCode_1: "2102",
    Preferred_CityCode_2: "2106",
    Preferred_CityCode_3: "2104",
  };

  const headers = {
    TokenID: "U@TUFnhDy6gur9B4",
    "Content-Type": "application/json",
  };

  const apiUrl =
    "https://uat-pearsonvue.excelindia.com/AmritaSchedulerAPI/User/SyncUser";

  try {
    const response = await axios.post(apiUrl, postData, { headers });
    console.log(response.data);

    return res.json("dsfsf");
  } catch (error) {
    console.log("error.data", error.response.data);

    throw new BadRequestError(error.response.data.StatusMessage);
  }
};
