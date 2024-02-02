import {
  sendingSlotBulkMail,
  verifyingAllCandidatesWorker,
} from "./handlers/admin/vendor";
import { syncingAeeTransactions } from "./handlers/misc";
import { syncingOmrCandidates } from "./handlers/omr";

export const worker = async (job) => {
  if (job.name === "verifyAllCandidates") {
    verifyingAllCandidatesWorker(job.data);
  }
  if (job.name === "sendSlotMailBulk") {
    sendingSlotBulkMail(job.data);
  }
  if (job.name === "syncingOmrCandidates") {
    syncingOmrCandidates(job.data);
  }
  if (job.name === "syncingTransactions") {
    syncingAeeTransactions(job.data);
  }
};
