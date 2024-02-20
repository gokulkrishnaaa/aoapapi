import { Router } from "express";
import {
  addBranch,
  addCampus,
  addCity,
  addCityForEntrance,
  addCourse,
  addDistrict,
  addGender,
  addInfoSource,
  addProduct,
  addProgrammeToEntrance,
  addSocialStatus,
  addState,
  createProgramme,
  getAllBranches,
  getBranchesFromCourse,
  getCampus,
  getCities,
  getCityForExam,
  getCityFromDistrict,
  getCityFromState,
  getCourses,
  getDistrictsFromState,
  getExamCityByState,
  getGender,
  getInfoSource,
  getProductByCode,
  getProducts,
  getProgrammes,
  getProgrammesByEntrance,
  getSocialStatus,
  getStates,
  removeBranch,
  removeCampus,
  removeCity,
  removeCityForEntrance,
  removeCourse,
  removeDistrict,
  removeEntranceFromProgram,
  removeGender,
  removeInfoSource,
  removeProduct,
  removeProgramme,
  removeSocialStatus,
  removeState,
  searchProgrammes,
  updateBranch,
  updateCampus,
  updateCity,
  updateCityForEntrance,
  updateCourse,
  updateDistrict,
  updateGender,
  updateInfoSource,
  updateProduct,
  updateSocialStatus,
  updateState,
} from "./handlers/master";
import {
  createAgentCandidateParent,
  createAgentCandidatePlustwo,
  createCandidate,
  createCandidateParent,
  createCandidatePlustwo,
  createJeeApplication,
  createOtp,
  currentUser,
  getOMROnboardedList,
  getOMRPendingList,
  getOMRDuplicateList,
  getOMRBookedList,
  getOMRNotBookedList,
  getStateOMRCandidates,
  getDateOMRCandidates,
  getDateWiseCandidatesCount,
  getAllCandidatesInfo,
  getAllCandidatesInfoByStatus,
  getAllAppliedCandidatesInfo,
  getCandidate,
  getCandidateById,
  getCandidateParent,
  getCandidateParentById,
  getCandidatePlustwoById,
  getCandidatePustwo,
  getJeeApplicationByCandidateId,
  getJeeApplicationById,
  getJeeApplicationByJeeId,
  putAgentOnboarding,
  putCandidate,
  putCandidateById,
  putOnboarding,
  signin,
  signout,
  updateCandidateParentById,
  updateCandidatePlustwoById,
  updateJeeApplication,
  checkCandidateRegistered,
  createOrUpdateCandidate,
} from "./handlers/candidate";
import { requireAuth } from "./middlewares/require-auth";
import {
  createEntrance,
  getEntrances,
  removeEntrance,
  updateEntrance,
} from "./handlers/entrance/entrance";
import {
  createApplication,
  createExam,
  getAllExams,
  getApplication,
  getOpenExams,
  updateExam,
  examPaymentFailure,
  examPaymentSuccess,
} from "./handlers/entrance";
import {
  checkExamValid,
  examAgentPaymentFailure,
  examAgentPaymentSuccess,
  examReattemptPaymentFailure,
  examReattemptPaymentSuccess,
  getExamByEntrance,
  getExamsByEntrance,
  registerForExam,
  registerForExamReattempt,
  verifyJeeTransaction,
  verifyTransaction,
  makeCandidatePaid,
} from "./handlers/entrance/exam";
import {
  addCityToApplication,
  addProgrammeToApplication,
  createEntranceApplication,
  getApplicationByCandidateId,
  getApplicationByExam,
  getApplicationByExamCandidate,
  getApplicationJeeStatus,
  getCityByApplication,
  getProgrammeByApplication,
  removeCityFromApplication,
  removeProgrammeFromApplication,
  updateApplication,
  updateApplicationJeeStatus,
  updateApplicationProgress,
} from "./handlers/entrance/application";
import { sendEmailOtp, sendWelcomeMail, verifyEmail } from "./handlers/email";
import {
  adminSignin,
  createAdminUser,
  currentAdminUser,
} from "./handlers/admin";
import { requireCandidate } from "./middlewares/require-candidate";
import { sendPhoneOtp, verifyPhone } from "./handlers/phone";
import {
  createEntranceTransaction,
  getTransactionsByApplication,
  getTransactionsByCandidate,
  getJEEDoubleTransaction,
  getReattemptDoubleTransaction,
  getAEEDoubleTransaction,
  getTransactionLog,
} from "./handlers/entrance/transactions";

import { importlocation, downloadExcel } from "./handlers/master";
import {
  getApplicationReport,
  getDistrictWiseReport,
  getExamCityCityReport,
  getExamCityReport,
  getExamCityStateReport,
  getExamRegisteredReport,
  getAEEEJEECount,
  getRefererReport,
  getRegisteredUsersByExam,
  getStateWiseReport,
  getUTMReport,
  getUTMReportBySource,
  getAllNonScholarshipReport,
  getProgramNonSchReport,
  getBranchNonSchReport,
  getCampusNonSchReport,
  getExcelNonSchReport,
} from "./handlers/admin/reports";
import { addReferer } from "./handlers/analytics";
import {
  agentSignin,
  createAgentUser,
  currentAgentUser,
  listAgents,
} from "./handlers/agent";
import {
  downloadCandidatesByUtmSource,
  downloadUtmCandidatesByEntrance,
  getAllApplicationsByAgent,
  getAllCandidatesByAgent,
  getApplicationsByAgent,
  getCandidatesByAgent,
  getCandidatesByUtmSource,
  getStatsByAgent,
  getUtmCandidatesByEntrance,
} from "./handlers/agent/reports";
import {
  forgotAgentPassword,
  getAgentDetails,
  removeAgent,
  updateAgent,
} from "./handlers/agent/agent";
import {
  createJee,
  getActiveJee,
  getAllJee,
  updateJee,
} from "./handlers/master/jee";
import {
  getJeeTransactionsByApplication,
  getJeeTransactionsByCandidate,
  createJeeTransaction,
  jeePaymentSuccess,
  jeePaymentFailure,
} from "./handlers/jee";
import {
  counsellorSignin,
  createCounsellor,
  currentCounsellorUser,
  forgotCounsellorPassword,
  getCounsellorDetails,
  listCounsellors,
  removeCounsellor,
  updateCounsellor,
} from "./handlers/counsellor";
import { getSlot } from "./handlers/counsellor/reports";
import {
  searchApplication,
  searchCandidate,
  searchRegistration,
  searchTransactionById,
} from "./handlers/search";
import {
  getFullAeeeDetailsByCandidateId,
  getFullJeeDetailsByCandidateId,
  getCandidateNonScholarshipData,
} from "./handlers/reports";
import { invokeAPI } from "./handlers/leadsquared";
import { invokebulkAPI } from "./handlers/leadsquared";
import { createCrmSignin } from "./handlers/crm";
import { getLoggedUser } from "./handlers/user/user";
import {
  createOrUpdateRank,
  createReattempt,
  getUtmSource,
  handleTransactionSync,
} from "./handlers/misc";
import { getEmailOtp, getNumberOtp } from "./handlers/utils/utils";
import {
  createOrUpdateAdmitCard,
  createOrUpdateExamSlot,
  handleRankUpload,
  pollRankImport,
  publishAeeeRank,
  sendSlotMailBulk,
  verifyAllCandidates,
  verifyCandidateSync,
} from "./handlers/admin/vendor";
import {
  createVendor,
  currentVendorUser,
  forgotVendorPassword,
  listVendors,
  removeVendor,
  vendorSignin,
} from "./handlers/vendor";
import {
  completeOMRRegistration,
  handleOmrUpload,
  handleSyncCandidates,
} from "./handlers/omr";
import {
  activateNonSchApplication,
  cancelNonSchApplication,
  createNonSchApplication,
  createNonSchIntake,
  getCurrentNonSchIntake,
  getNonSchAppnlByCandidateId,
  getNonSchAppnlById,
  getNonSchIntake,
  updateNonSchApplication,
} from "./handlers/nonscholarship";

const router = Router();

// user
router.get("/loggeduser", requireAuth, getLoggedUser);

//candidate
router.post("/candiate/createotp", createOtp);
router.post("/candidate/signin", signin);
router.post("/candidate/signout", requireAuth, signout);
router.post("/candidate/currentuser", requireAuth, currentUser);
router.get(
  "/candidate/isregistered/:id",
  requireAuth,
  checkCandidateRegistered
);
router.get("/candidate", requireAuth, requireCandidate, getCandidate);
router.post("/candidate", requireAuth, createCandidate);
router.post("/candidate/upsert", requireAuth, createOrUpdateCandidate);
router.put("/candidate", requireAuth, putCandidate);

router.post("/candidate/parent", requireAuth, createCandidateParent);
router.post("/candidate/parent/agent", requireAuth, createAgentCandidateParent);
router.get("/candidate/parent", getCandidateParent);
router.get("/candidate/parent/:id", requireAuth, getCandidateParentById);
router.post("/candidate/plustwo", requireAuth, createCandidatePlustwo);
router.post(
  "/candidate/plustwo/agent",
  requireAuth,
  createAgentCandidatePlustwo
);
router.get("/candidate/plustwo", requireAuth, getCandidatePustwo);
router.get("/candidate/plustwo/:id", requireAuth, getCandidatePlustwoById);
router.put("/candidate/onboarding", requireAuth, putOnboarding);
router.put("/candidate/onboarding/agent", requireAuth, putAgentOnboarding);
router.get("/candidate/:id", requireAuth, getCandidateById);
router.put("/candidate/:id", requireAuth, putCandidateById);
router.put("/candidate/:id/parent", requireAuth, updateCandidateParentById);
router.put("/candidate/:id/plustwo", requireAuth, updateCandidatePlustwoById);
router.get("/candidates", getAllCandidatesInfo);
router.get("/candidatefilter/:status", getAllCandidatesInfoByStatus);
router.get("/candidatefilter/:status/:isOMR", getAllCandidatesInfoByStatus);
router.get("/candidateapplied", getAllAppliedCandidatesInfo);
router.get("/candidateapplied/:isOMR", getAllAppliedCandidatesInfo);
router.get(
  "/candidates/consolidated/date/:fromDate/:toDate",
  getDateWiseCandidatesCount
);
router.get("/omrcandidates/onboarded", getOMROnboardedList);
router.get("/omrcandidates/pending", getOMRPendingList);
router.get("/omrcandidates/duplicate", getOMRDuplicateList);
router.get("/omrcandidates/slotbooked", getOMRBookedList);
router.get("/omrcandidates/slotnotbooked", getOMRNotBookedList);
router.get("/omrcandidates/state", getStateOMRCandidates);
router.get("/omrcandidates/date/:fromDate/:toDate", getDateOMRCandidates);

//master data
router.get("/master/gender", requireAuth, getGender);
router.post("/master/gender", requireAuth, addGender);
router.put("/master/gender/:id", requireAuth, updateGender);
router.delete("/master/gender/:id", requireAuth, removeGender);

router.get("/master/product", requireAuth, getProducts);
router.get("/master/product/code/:code", requireAuth, getProductByCode);
router.post("/master/product", requireAuth, addProduct);
router.put("/master/product/:id", requireAuth, updateProduct);
router.delete("/master/product/:id", requireAuth, removeProduct);

router.get("/master/socialstatus", requireAuth, getSocialStatus);
router.post("/master/socialstatus", requireAuth, addSocialStatus);
router.put("/master/socialstatus/:id", requireAuth, updateSocialStatus);
router.delete("/master/socialstatus/:id", requireAuth, removeSocialStatus);
router.get("/master/infosource", requireAuth, getInfoSource);
router.post("/master/infosource", requireAuth, addInfoSource);
router.put("/master/infosource/:id", requireAuth, updateInfoSource);
router.delete("/master/infosource/:id", requireAuth, removeInfoSource);
router.get("/master/states", requireAuth, getStates);
router.post("/master/states", requireAuth, addState);
router.put("/master/states/:id", requireAuth, updateState);
router.delete("/master/states/:id", requireAuth, removeState);
router.get("/master/course", requireAuth, getCourses);
router.post("/master/course/", requireAuth, addCourse);
router.put("/master/course/:id", requireAuth, updateCourse);
router.delete("/master/course/:id", requireAuth, removeCourse);
router.post("/master/campus/", requireAuth, addCampus);
router.get("/master/campus/", requireAuth, getCampus);
router.put("/master/campus/:id", requireAuth, updateCampus);
router.delete("/master/campus/:id", requireAuth, removeCampus);
router.get("/master/district/:stateId", requireAuth, getDistrictsFromState);
router.post("/master/district/", requireAuth, addDistrict);
router.put("/master/district/:id", requireAuth, updateDistrict);
router.delete("/master/district/:id", requireAuth, removeDistrict);
router.post("/master/branch/", requireAuth, addBranch);
router.get("/master/branches/", requireAuth, getAllBranches);
router.put("/master/branch/:id", requireAuth, updateBranch);
router.delete("/master/branch/:id", requireAuth, removeBranch);
router.get("/master/branches/:courseid", requireAuth, getBranchesFromCourse);

router.get("/master/city/:districtId", requireAuth, getCityFromDistrict);
router.get("/master/city/state/:stateId", requireAuth, getCityFromState);
router.get("/master/city/", requireAuth, getCities);
router.post("/master/city/", requireAuth, addCity);
router.put("/master/city/:id", requireAuth, updateCity);
router.delete("/master/city/:id", requireAuth, removeCity);

router.post("/master/programme/", requireAuth, createProgramme);
router.post("/master/search/programme", requireAuth, searchProgrammes);
router.get("/master/programme/", requireAuth, getProgrammes);
router.delete("/master/programme/:id", requireAuth, removeProgramme);

router.get("/master/examcity/:entranceId", requireAuth, getCityForExam);
router.get(
  "/master/examcity/:entranceId/:stateId",
  requireAuth,
  getExamCityByState
);
router.post("/master/examcity/", requireAuth, addCityForEntrance);
router.put("/master/examcity/:id", requireAuth, updateCityForEntrance);
router.delete(
  "/master/examcity/:entranceId/:cityId",
  requireAuth,
  removeCityForEntrance
);
router.post("/master/importcity", importlocation);

router.post("/master/entrance/programme", requireAuth, addProgrammeToEntrance);
router.delete(
  "/master/entrance/:entranceId/programme/:programmeId",
  requireAuth,
  removeEntranceFromProgram
);
router.get(
  "/master/entrance/:entranceId/programme",
  requireAuth,
  getProgrammesByEntrance
);

// entrance and exam
router.post("/entrance", requireAuth, createEntrance);
router.get("/entrance", requireAuth, getEntrances);
router.get("/entrance/:id/exam", requireAuth, getExamByEntrance);
router.delete("/entrance/:id", requireAuth, removeEntrance);
router.put("/entrance/:id", requireAuth, updateEntrance);
router.post("/exam", requireAuth, createExam);
router.put("/exam/:id", requireAuth, updateExam);
router.post("/exam/check/:id", requireAuth, checkExamValid);
router.get("/exam/open", requireAuth, getOpenExams);
router.post("/exam/register", requireAuth, registerForExam);
router.post("/exam/reattempt", requireAuth, registerForExamReattempt);
router.post("/exam/paymentsuccess", examPaymentSuccess);
router.post("/exam/paymentreattemptsuccess", examReattemptPaymentSuccess);
router.post("/exam/paymentfailure", examPaymentFailure);
router.post("/exam/paymentreattemptfailure", examReattemptPaymentFailure);
router.get("/exam", requireAuth, getAllExams);
router.get("/exam/makepaid", requireAuth, makeCandidatePaid);

router.post("/application", requireAuth, createApplication);
router.post("/entrance/application", requireAuth, createEntranceApplication);
router.post(
  "/application/:id/progress",
  requireAuth,
  updateApplicationProgress
);
router.get("/application/:id", requireAuth, getApplication);
router.get(
  "/application/candidate/latest/aeee",
  requireAuth,
  getApplicationByCandidateId
);
router.put("/application/:id", requireAuth, updateApplication);
router.get("/application/exam/:examid/", requireAuth, getApplicationByExam);
router.get(
  "/application/exam/:examId/:candidateId",
  requireAuth,
  getApplicationByExamCandidate
);
router.post(
  "/application/:id/programme",
  requireAuth,
  addProgrammeToApplication
);
router.delete(
  "/application/:id/programme/:programmeId",
  requireAuth,
  removeProgrammeFromApplication
);
router.get(
  "/application/:id/programme",
  requireAuth,
  getProgrammeByApplication
);
router.post("/application/:id/jee", requireAuth, updateApplicationJeeStatus);
router.get("/application/:id/jee", requireAuth, getApplicationJeeStatus);
router.post("/application/:id/city", requireAuth, addCityToApplication);
router.get("/application/:id/city", requireAuth, getCityByApplication);
router.delete(
  "/application/:id/city/:examcityId",
  requireAuth,
  removeCityFromApplication
);

router.get(
  "/transactions/application/:id",
  requireAuth,
  getTransactionsByApplication
);

router.post("/transactions/entrance/", requireAuth, createEntranceTransaction);
router.get("/transactions/entrance/", requireAuth, getTransactionsByCandidate);
router.post(
  "/transactions/entrance/double/jee",
  requireAuth,
  getJEEDoubleTransaction
);
router.post(
  "/transactions/entrance/double/reattempt",
  requireAuth,
  getReattemptDoubleTransaction
);
router.post(
  "/transactions/entrance/double/aeee",
  requireAuth,
  getAEEDoubleTransaction
);
router.get("/transactions/entrance/:txnid", requireAuth, getTransactionLog);

router.get(
  "/transactions/jee/application/:id",
  requireAuth,
  getJeeTransactionsByApplication
);

router.post("/transactions/jee/", requireAuth, createJeeTransaction);
router.get(
  "/transactions/jee/candidate",
  requireAuth,
  getJeeTransactionsByCandidate
);
router.post("/transactions/verify", verifyTransaction);
router.post("/transactions/jeeverify", verifyJeeTransaction);
router.post("/transactions/synctransactionlog", handleTransactionSync);

router.post("/jee/paymentsuccess", jeePaymentSuccess);
router.post("/jee/paymentfailure", jeePaymentFailure);

// non shcolarship
router.post("/nonscholarship/application", createNonSchApplication);
router.post("/nonscholarship/intake", requireAuth, createNonSchIntake);
router.get("/nonscholarship/intake", requireAuth, getNonSchIntake);
router.get(
  "/nonscholarship/currentintake",
  requireAuth,
  getCurrentNonSchIntake
);
router.get(
  "/nonscholarship/application/:candidateid/:intakeid",
  getNonSchAppnlByCandidateId
);
router.get("/nonscholarship/application/:id", getNonSchAppnlById);
router.put("/nonscholarship/application/:id", updateNonSchApplication);
router.put("/nonscholarship/cancel/:id", cancelNonSchApplication);
router.put("/nonscholarship/activate/:id", activateNonSchApplication);

router.post("/email/otp", sendEmailOtp);
router.get("/email/welcome", requireAuth, sendWelcomeMail);
router.post("/email/verify", verifyEmail);
router.post("/phone/otp", sendPhoneOtp);
router.post("/phone/verify", verifyPhone);

//admin
router.post("/admin/signin", adminSignin);
router.post("/admin/register", createAdminUser);
router.post("/admin/currentuser", requireAuth, currentAdminUser);
router.post("/admin/reports/utm", requireAuth, getUTMReport);
router.post("/admin/reports/utmsource", requireAuth, getUTMReportBySource);
router.post("/admin/reports/application", requireAuth, getApplicationReport);
router.post("/admin/reports/state", requireAuth, getStateWiseReport);
router.post("/admin/reports/examcity", requireAuth, getExamCityReport);
router.get(
  "/admin/reports/registered/:examid",
  requireAuth,
  getRegisteredUsersByExam
);
router.get(
  "/admin/reports/examcity/states/:entranceid",
  requireAuth,
  getExamCityStateReport
);
router.get(
  "/admin/reports/examcity/city/:entranceid",
  requireAuth,
  getExamCityCityReport
);
router.post(
  "/admin/reports/district/:stateId",
  requireAuth,
  getDistrictWiseReport
);
router.get(
  "/admin/reports/examregistered",
  requireAuth,
  getExamRegisteredReport
);
router.get("/admin/reports/referer", requireAuth, getRefererReport);
router.get("/admin/reports/aeeejeecount", getAEEEJEECount);
router.post("/analytics/referer", addReferer);
router.get("/admin/reports/nonscholarship/all", getAllNonScholarshipReport);
router.get("/admin/reports/nonscholarship/program", getProgramNonSchReport);
router.get("/admin/reports/nonscholarship/branch", getBranchNonSchReport);
router.get("/admin/reports/nonscholarship/campus", getCampusNonSchReport);
router.get("/admin/reports/nonscholarship", getExcelNonSchReport);

//agent
router.post("/admin/agent/create", createAgentUser);
router.put("/admin/agent/:id", updateAgent);
router.delete("/admin/agent/:id", removeAgent);
router.get("/admin/agent/list", listAgents);
router.post("/admin/agent/signin", agentSignin);
router.post("/admin/agent/currentuser", requireAuth, currentAgentUser);
router.get("/admin/agent/", requireAuth, getAgentDetails);

// counsellor
router.post("/admin/counsellor/create", createCounsellor);
router.get("/admin/counsellor/list", listCounsellors);
router.delete("/admin/counsellor/:id", removeCounsellor);
router.put("/admin/counsellor/:id", updateCounsellor);
router.post("/admin/counsellor/signin", counsellorSignin);
router.post(
  "/admin/counsellor/currentuser",
  requireAuth,
  currentCounsellorUser
);
router.get("/admin/counsellor/", requireAuth, getCounsellorDetails);

router.post("/counsellor/forgotpassword", forgotCounsellorPassword);
router.post("/counsellor/reports", getSlot);

// vendor
router.post("/admin/vendor/currentuser", requireAuth, currentVendorUser);
router.get("/admin/vendor/list", listVendors);
router.post("/admin/vendor/create", createVendor);
router.post("/admin/vendor/signin", vendorSignin);
router.post("/vendor/forgotpassword", forgotVendorPassword);
router.delete("/admin/vendor/:id", removeVendor);

// JEE Routes
router.post("/admin/jee/", createJee);
router.put("/admin/jee/:id", updateJee);
router.get("/admin/jee/", getAllJee);
router.get("/admin/jee/active", getActiveJee);
router.get("/candidate/jee/:jeeid", getJeeApplicationByJeeId);
router.post("/candidate/jee/application", createJeeApplication);
router.get("/candidate/jee/application/:id", getJeeApplicationById);
router.get(
  "/jee/application/candidate",
  requireAuth,
  getJeeApplicationByCandidateId
);
router.put("/candidate/jee/application/:id", updateJeeApplication);

// search
router.post("/search/candidate", searchCandidate);
router.post("/search/application", searchApplication);
router.post("/search/registration", searchRegistration);
router.post("/search/transaction", searchTransactionById);

// agent reports
router.post("/agent/reports/utm/:source", getCandidatesByUtmSource);
router.post(
  "/agent/reports/download/utm/:source",
  downloadCandidatesByUtmSource
);
router.post("/agent/reports/exam/:source", getUtmCandidatesByEntrance);
router.post(
  "/agent/reports/download/exam/:source",
  downloadUtmCandidatesByEntrance
);

router.post("/agent/forgotpassword", forgotAgentPassword);
router.get("/agent/all/candidates", requireAuth, getAllCandidatesByAgent);
router.post("/agent/:id/candidates", requireAuth, getCandidatesByAgent);

router.get("/agent/all/applications", requireAuth, getAllApplicationsByAgent);
router.post("/agent/:id/applications", requireAuth, getApplicationsByAgent);

router.get("/agent/:id/stats", requireAuth, getStatsByAgent);

router.post("/exam/agentpaymentsuccess", examAgentPaymentSuccess);
router.post("/exam/agentpaymentfailure", examAgentPaymentFailure);

// reports
router.get(
  "/reports/candidate/aeee/:candidateId",
  getFullAeeeDetailsByCandidateId
);
router.get(
  "/reports/candidate/jee/:candidateId",
  getFullJeeDetailsByCandidateId
);
router.get(
  "/reports/candidate/nonscholarship/:candidateId",
  getCandidateNonScholarshipData
);

router.get("/reports/download-excel", downloadExcel);

router.get("/data/utmsource", getUtmSource);

router.post("/crm/signin", createCrmSignin);
router.post("/cheatcode/q1w2e3r4t5/number", getNumberOtp);
router.post("/cheatcode/q1w2e3r4t5/mail", getEmailOtp);

router.get("/vendor/examcenter/usersync/:regno", verifyCandidateSync);
router.get("/vendor/examcenter/allusers/:examid", verifyAllCandidates);
router.get("/vendor/examcenter/slotmail", sendSlotMailBulk);
router.post("/aee/slotconfirmation", createOrUpdateExamSlot);
router.post("/aee/examlocation", createOrUpdateAdmitCard);
router.post("/aee/rankimport", handleRankUpload);
router.post("/aee/rankimportpoll", pollRankImport);
router.post("/aee/rankpublish", requireAuth, publishAeeeRank);

router.post("/omr/upload", handleOmrUpload);
router.get("/omr/synccandidates", handleSyncCandidates);
router.post("/omr/completeregisration", completeOMRRegistration);

router.get("/healthcheck", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running smoothly",
    timestamp: new Date(),
  });
});

router.post("/leadsquared/lsqbulkAPI", invokebulkAPI);
router.post("/leadsquared/apirequest", invokeAPI);

// test apis
router.post("/aee/reattempt", createReattempt);
router.post("/aee/rankcreate", createOrUpdateRank);

export default router;
