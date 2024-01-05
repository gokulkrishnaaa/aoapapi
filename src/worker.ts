import {
  sendingSlotBulkMail,
  verifyingAllCandidatesWorker,
} from "./handlers/admin/vendor";

export const worker = async (job) => {
  if (job.name === "verifyAllCandidates") {
    verifyingAllCandidatesWorker(job.data);
  }
  if (job.name === "sendSlotMailBulk") {
    sendingSlotBulkMail(job.data);
  }
};
