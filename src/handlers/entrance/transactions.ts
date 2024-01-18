import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { BadRequestError } from "../../errors/bad-request-error";
import { CannotProcessError } from "../../errors/cannot-process-error";
import XLSX from "xlsx";

export const getTransactionsByApplication = async (req, res) => {
  const { role } = req.currentUser;
  const examapplicationId = req.params.id;

  if (!examapplicationId) {
    throw new BadRequestError("Input is invalid");
  }

  let whereClause: {
    examapplicationId: string;
    type?: "ONLINE" | "AGENT";
  } = {
    examapplicationId,
  };

  if (role === "candidate") {
    whereClause.type = "ONLINE";
  } else if (role === "agent") {
    whereClause.type = "AGENT";
  }

  const entrancePayments = await prisma.entrancePayments.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc", // Sort by createdAt in descending order (latest to oldest)
    },
    include: {
      examapplication: true, 
    },
  });

  return res.json(entrancePayments);
};

export const getTransactionsByCandidate = async (req, res) => {
  const { id } = req.currentUser;

  const entrancePayments = await prisma.entrancePayments.findMany({
    where: {
      candidateId: id,
      type: "ONLINE",
    },
    orderBy: {
      createdAt: "desc", // Sort by createdAt in descending order (latest to oldest)
    },
  });

  return res.json(entrancePayments);
};

export const createEntranceTransaction = async (req, res) => {
  const { candidateId, examapplicationId, description, amount, type } =
    req.body;
  const randomNumber = Math.floor(Date.now());

  const reference = `AEEE-${candidateId
    .slice(0, 4)
    .toUpperCase()}-${examapplicationId
    .slice(0, 4)
    .toUpperCase()}-${randomNumber}`;

  try {
    const newTransaction = await prisma.entrancePayments.create({
      data: {
        reference,
        candidateId,
        examapplicationId,
        description,
        amount,
        type: type ? type : "ONLINE",
      },
    });
    return res.json(newTransaction);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Transaction cannot be created");
  }
};

export const getFailedTransaction = async (req, res) => {

  const  download  = req.body.download;

  let entrancepayments = await prisma.entrancePayments.findMany({
    where: {
      status: 'FAILED',
    },
    include: {
      candidate: true,
      examapplication: {
          include: {
            exam: true,
            Registration: {
              select: {
                registrationNo: true
              }
            },
            EntrancePayments: true,
          },
        },
    },
  });

  if (download) {
      const formatted = entrancepayments.map((row) => ({     
        Name: row.candidate?.fullname,
        Email: row.candidate?.email,
        Phone: row.candidate?.phone,
        ApplicationNo : row.examapplication.reference ? row.examapplication.reference:null,
        RegistrationNo : row.examapplication.Registration[0]?.registrationNo,
        Transactions : row.examapplication.EntrancePayments?.length, 
      }));
      //   return res.json(formatted);
      console.log("Failed Payment", formatted);


      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add a worksheet to the workbook
      const worksheet = XLSX.utils.json_to_sheet(formatted);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Set the appropriate headers for the response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx");

      // Send the workbook directly to the response
      res.end(XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
  }
    else{       
      return res.json(entrancepayments);
    }
};

export const getExcessTransaction = async (req, res) => {
  
 const {amount} = req.params;
  
  const product = await prisma.products.findFirst({
    where: {
      amount,
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const excessAmount = product.amount; 
  const  download  = req.body.download;

  let entrancepayments = await prisma.entrancePayments.findMany({
    where: {
      amount: {
        gt: excessAmount, 
      },
    },
    include: {
      candidate: true,
      examapplication: {
        include: {
          exam: true,
          Registration: {
            select: {
              registrationNo: true
            }
          },
          EntrancePayments: true,
        },
      },
    },
  });

  // console.log('Entrance Payments:', entrancepayments);

  if (download) {
    const formatted = entrancepayments.map((row) => ({     
      Name: row.candidate?.fullname,
      Email: row.candidate?.email,
      Phone: row.candidate?.phone,
      ApplicationNo : row.examapplication.reference ? row.examapplication.reference:null,
      RegistrationNo : row.examapplication.Registration[0]?.registrationNo,
      Transactions : row.examapplication.EntrancePayments?.length, 
    }));
      //   return res.json(formatted);
      console.log('Formatted Data:', formatted);
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add a worksheet to the workbook
      const worksheet = XLSX.utils.json_to_sheet(formatted);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      // Set the appropriate headers for the response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx");

      // Send the workbook directly to the response
      res.end(XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
  }
  
  else{    
       
    return res.json(entrancepayments);
  }
};

export const getDoubleTransaction = async (req, res) => {

  const  download  = req.body.download;

  let entrancepayments = await prisma.entrancePayments.findMany({

    where: {
      status: 'SUCCESS', 
    },
    include: {
      candidate: true,
      examapplication: {
          include: {
            exam: true,
            Registration: {
              select: {
                registrationNo: true
              }
            },
            EntrancePayments: true,
          },
        },
    },
  });

  const doublePayments = entrancepayments.filter((payment, index, self) => {
    return (
      self.findIndex(
        (p) => p.candidateId === payment.candidateId && p.status === 'SUCCESS'
      ) !== index
    );
  });

  if (download) {
    const formatted = entrancepayments.map((row) => ({     
      Name: row.candidate?.fullname,
      Email: row.candidate?.email,
      Phone: row.candidate?.phone,
      ApplicationNo : row.examapplication.reference ? row.examapplication.reference:null,
      RegistrationNo : row.examapplication.Registration[0]?.registrationNo,
      Transactions : row.examapplication.EntrancePayments?.length, 
    }));

    //   return res.json(formatted);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a worksheet to the workbook
    const worksheet = XLSX.utils.json_to_sheet(formatted);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Set the appropriate headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx");

    // Send the workbook directly to the response
    res.end(XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
  }
  else{
     return res.json(doublePayments); 
  }
};
