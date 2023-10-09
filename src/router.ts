import { Router } from "express";
import {
  addGender,
  addProgrammeToEntrance,
  createCampus,
  createCourse,
  createProgramme,
  getCampus,
  getCityForExam,
  getCityFromDistrict,
  getDistrictsFromState,
  getGender,
  getInfoSource,
  getProgrammesByEntrance,
  getSocialStatus,
  getStates,
  removeGender,
  updateGender,
} from "./handlers/master";
import {
  createCandidateParent,
  createCandidatePlustwo,
  createOtp,
  currentUser,
  getCandidate,
  getCandidateParent,
  getCandidatePustwo,
  putCandidate,
  putOnboarding,
  signin,
  signout,
} from "./handlers/candidate";
import { requireAuth } from "./middlewares/require-auth";
import { createEntrance, getEntrances } from "./handlers/entrance/entrance";
import {
  createApplication,
  createExam,
  getAllExams,
  getApplication,
  getOpenExams,
  updateExam,
} from "./handlers/entrance";
import { checkExamValid, getExamsByEntrance } from "./handlers/entrance/exam";
import {
  addCityToApplication,
  addProgrammeToApplication,
  getApplicationByExam,
  getApplicationJeeStatus,
  getCityByApplication,
  getProgrammeByApplication,
  removeCityFromApplication,
  removeProgrammeFromApplication,
  updateApplication,
  updateApplicationJeeStatus,
  updateApplicationProgress,
} from "./handlers/entrance/application";
import { sendEmailOtp, verifyEmail } from "./handlers/email";
import {
  adminSignin,
  createAdminUser,
  currentAdminUser,
} from "./handlers/admin";
import { requireCandidate } from "./middlewares/require-candidate";

const router = Router();

//candidate
router.post("/candiate/createotp", createOtp);
router.post("/candidate/signin", signin);
router.post("/candidate/signout", requireAuth, signout);
router.post("/candidate/currentuser", requireAuth, currentUser);
router.get("/candidate", requireAuth, requireCandidate, getCandidate);
router.put("/candidate", requireAuth, putCandidate);
router.post("/candidate/parent", requireAuth, createCandidateParent);
router.get("/candidate/parent", requireAuth, getCandidateParent);
router.post("/candidate/plustwo", requireAuth, createCandidatePlustwo);
router.get("/candidate/plustwo", requireAuth, getCandidatePustwo);
router.put("/candidate/onboarding", requireAuth, putOnboarding);

//master data
router.get("/master/gender", getGender);
router.post("/master/gender", addGender);
router.put("/master/gender/:id", updateGender);
router.delete("/master/gender/:id", removeGender);
router.get("/master/socialstatus", getSocialStatus);
router.get("/master/infosource", getInfoSource);
router.get("/master/states", getStates);
router.get("/master/district/:stateId", getDistrictsFromState);
router.get("/master/city/:districtId", getCityFromDistrict);
router.get("/master/examcity/:entranceid", getCityForExam);
router.post("/master/course/", createCourse);
router.post("/master/campus/", createCampus);
router.get("/master/campus/", getCampus);
router.post("/master/programme/", createProgramme);
router.post("/master/entrance/programme", addProgrammeToEntrance);
router.get("/master/entrance/:entranceId/programme", getProgrammesByEntrance);

// entrance and exam
router.post("/entrance", requireAuth, createEntrance);
router.get("/entrance", requireAuth, getEntrances);
router.post("/exam", requireAuth, createExam);
router.put("/exam/:id", requireAuth, updateExam);
router.post("/exam/check/:id", requireAuth, checkExamValid);
router.get("/exam/open", requireAuth, getOpenExams);
router.get("/exam", requireAuth, getAllExams);
router.get("/exam/:entranceId", requireAuth, getExamsByEntrance);
router.post("/application", requireAuth, createApplication);
router.post(
  "/application/:id/progress",
  requireAuth,
  updateApplicationProgress
);
router.get("/application/:id", requireAuth, getApplication);
router.put("/application/:id", requireAuth, updateApplication);
router.get("/application/exam/:examid/", requireAuth, getApplicationByExam);
router.post("/application/:id/programme", addProgrammeToApplication);
router.delete(
  "/application/:id/programme/:programmeId",
  removeProgrammeFromApplication
);
router.get("/application/:id/programme", getProgrammeByApplication);
router.post("/application/:id/jee", updateApplicationJeeStatus);
router.get("/application/:id/jee", getApplicationJeeStatus);
router.post("/application/:id/city", addCityToApplication);
router.get("/application/:id/city", getCityByApplication);
router.delete("/application/:id/city/:examcityId", removeCityFromApplication);
router.post("/email/otp", sendEmailOtp);
router.post("/email/verify", verifyEmail);

//admin
router.post("/admin/signin", adminSignin);
router.post("/admin/register", createAdminUser);
router.post("/admin/currentuser", requireAuth, currentAdminUser);

export default router;
