import prisma from "../../db";

export const logTransaction = async (txnid, log) => {
  await prisma.transactionLog.upsert({
    where: {
      txnid: txnid, // Unique identifier to check if the record exists
    },
    update: {
      log: log, // Fields to update if the record exists
    },
    create: {
      txnid: txnid, // Fields to insert if the record does not exist
      log: log,
    },
  });
};
