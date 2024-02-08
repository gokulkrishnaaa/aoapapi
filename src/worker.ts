import {
  sendingSlotBulkMail,
  storeAeeeRankWorker,
  verifyingAllCandidatesWorker,
} from "./handlers/admin/vendor";
import { syncingTransactions } from "./handlers/misc";
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
    syncingTransactions(job.data);
  }
  if (job.name === "storeAeeeRankWorker") {
    storeAeeeRankWorker(job.data);
  }
};
