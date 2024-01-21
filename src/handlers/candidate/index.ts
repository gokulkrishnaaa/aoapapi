export { checkCandidateRegistered } from "./registration";

export {
  createJeeApplication,
  getJeeApplicationByJeeId,
  getJeeApplicationById,
  updateJeeApplication,
  getJeeApplicationByCandidateId,
} from "./jee";
export {
  getCandidate,
  getCandidateById,
  getAllCandidatesInfo,
  getAllCandidatesInfoByStatus,
  getAllAppliedCandidatesInfo,
  getDateWiseCandidatesCount,
  getOMROnboardedList,
  getOMRBookedList,
  getOMRNotBookedList,
  getStateOMRCandidates,
  getDateOMRCandidates,
  getOMRPendingList,
  getOMRDuplicateList,
} from "./getCandidate";
export { signout } from "./signout";
export { signin } from "./signin";
export { createOtp } from "./getotp";
export { currentUser } from "./currentuser";
export {
  createCandidate,
  putCandidate,
  putCandidateById,
} from "./putCandidate";
export {
  createCandidateParent,
  updateCandidateParentById,
  createAgentCandidateParent,
  updateCandidatePlustwoById,
} from "./createCandidateParent";
export {
  getCandidateParent,
  getCandidateParentById,
} from "./getCandidateParent";
export {
  createCandidatePlustwo,
  createAgentCandidatePlustwo,
} from "./createCandidatePlustwo";
export {
  getCandidatePustwo,
  getCandidatePlustwoById,
} from "./getCandidatePustwo";
export { putOnboarding, putAgentOnboarding } from "./putOnboarding";
