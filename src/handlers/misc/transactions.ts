import prisma from "../../db";
import { InternalServerError } from "../../errors/internal-server-error";
import mainqueue from "../../queue";
import { sha512 } from "../../utilities/hashutils";
import { logTransaction } from "../utils/transactions";

export const handleAeeTransactionSync = async (req, res) => {
  // get all candidates from omrmigrate table

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
      (job) => job.name === "syncingTransactions"
    );

    console.log("job already queued", isJobAlreadyQueued);

    if (isJobAlreadyQueued) {
      return res.status(400).json({
        message: "Transaction syncing is already in progress.",
      });
    }

    // Enqueue a single job for verifying all candidates
    await mainqueue.add("syncingTransactions", {});

    return res.json({
      message: "Transactions to be synced enqueued",
    });
  } catch (error) {
    console.error(`Error in syncingTransactions: ${error.message}`);
    throw new InternalServerError("Error in syncing transactions");
  }
};

export const syncingAeeTransactions = async (data) => {
  console.log("syncing transactions", data);

  // get all entrance payments
  const transactions = await prisma.entrancePayments.findMany();
  // iterate and get the transaction id .
  for (const transaction of transactions) {
    const txnid = transaction.txnid;

    // production 1 details
    // const key = "5serGB";
    // const salt = "SfUWYazGo07yRh3gH0BEjTbzxCliTVCQ";
    // const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

    // production 2 details
    // const key = "ypfBaj";
    // const salt = "aG3tGzBZ";
    // const chkUrl = "https://info.payu.in/merchant/postservice?form=2";

    //development details
    const key = "aJ1WVm";
    const salt = "hKmYSMBAzg5QOw64IV9MFtcu6BKaIyYA";
    const chkUrl = "https://test.payu.in/merchant/postservice?form=2";

    // const key = process.env.PAYU_KEY;
    // const salt = process.env.PAYU_SALT;
    // const chkUrl = process.env.PAYU_CHKURL;

    const command = "verify_payment";

    const chkHeaders = {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const hashString = `${key}|${command}|${txnid}|${salt}`;

    const hash = sha512(hashString);

    const formData = new URLSearchParams();
    formData.append("key", key);
    formData.append("command", "verify_payment");
    formData.append("var1", txnid);
    formData.append("hash", hash);

    const chkResponse = await fetch(chkUrl, {
      method: "POST",
      headers: chkHeaders,
      body: formData,
    });
    const chkResponseData = await chkResponse.json();
    console.log("check respons", chkResponseData);

    // get all details and ssave to db
    if (chkResponseData["status"]) {
      console.log("details  found", txnid);
      await logTransaction(txnid, chkResponseData);
    } else {
      console.log("details not found", txnid);
    }
  }
};
