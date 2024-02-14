import { Row } from "@react-email/components";
import prisma from "../../db";
import XLSX from "xlsx";
import { application } from "express";
import { Prisma } from "@prisma/client";

export const getCandidate = async (req, res) => {
  const { id } = req.currentUser;
  console.log("user id", id);
  let candidate = null;

  if (id) {
    candidate = await prisma.candidate.findUnique({
      where: {
        id,
      },
      include: {
        gender: true,
        socialstatus: true,
        infosource: true,
        state: true,
        district: true,
        city: true,
        ParentInfo: true,
        PlusTwoInfo: true,
      },
    });
  }
  return res.json(candidate);
};

export const getCandidateById = async (req, res) => {
  const { id } = req.params;
  let candidate = await prisma.candidate.findFirst({
    where: {
      id,
    },
    include: {
      gender: true,
      socialstatus: true,
      infosource: true,
      state: true,
      district: true,
      city: true,
      Onboarding: true,
    },
  });
  return res.json(candidate);
};

// Get all candidates details : RG
export const getAllCandidatesInfo = async (req, res) => {
  let candidates = [];
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };

  const allCandidates = await prisma.candidate.findMany({
    include: {
      gender: true,
      socialstatus: true,
      infosource: true,
      state: true,
      district: true,
      city: true,
      Onboarding: true,
      ParentInfo: true,
      PlusTwoInfo: {
        include: {
          state: true,
        },
      },
      ExamApplication: {
        include: {
          exam: {
            include: {
              entrance: true,
            },
          },
          Registration: true,
          ApplicationJEE: true,
          ApplicationCities: {
            include: {
              examcity: {
                include: {
                  city: true,
                },
              },
            },
          },
        },
      },
      EntrancePayments: true,
      JEEApplication: true,
      JEEPayments: true,
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      DOB: new Date(row.dob).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      Gender: row.gender ? row.gender.name : null,
      Status: row.socialstatus ? row.socialstatus.name : null,
      Email: row.email,
      Phone: row.phone,
      info: row.infosource ? row.infosource.name : null,
      aadhaar: row.aadhaarnumber,
      State: row.state ? row.state.name : null,
      District: row.district ? row.district.name : null,
      City: row.city ? row.city.name : row.otherCity,
      Address1: row.address1,
      Address2: row.address2,
      ParentName: row.ParentInfo ? row.ParentInfo.fullname : null,
      ParentEmail: row.ParentInfo ? row.ParentInfo.email : null,
      ParentPhone: row.ParentInfo ? row.ParentInfo.phone : null,
      PlusTwoState: row.PlusTwoInfo
        ? row.PlusTwoInfo.state
          ? row.PlusTwoInfo.state.name
          : row.PlusTwoInfo.otherState
          ? row.PlusTwoInfo.otherState
          : null
        : null,
    };

    let entrance = {
      ...basic,
      AEEERegNo: null,
      AEEEApplnNo: null,
      AEEECities: null,
      AEEEJEE: null,
    };

    row.ExamApplication.forEach((appln) => {
      if (appln.exam.entrance.code === "AEEE") {
        entrance = {
          ...entrance,
          AEEERegNo: appln.Registration[0]
            ? appln.Registration[0].registrationNo
            : null,
          AEEEApplnNo: appln.reference,
          AEEEJEE: appln.ApplicationJEE.jee,
          AEEECities: appln.ApplicationCities.reduce((acc, city) => {
            if (acc !== "") {
              acc += ", ";
            }
            return acc + city.examcity.city.name;
          }, ""),
        };
      }
    });

    let jee = {
      ...entrance,
      JEEApplnNo: null,
      JEEStatus: null,
    };

    if (row.JEEApplication[0]) {
      jee = {
        ...jee,
        JEEApplnNo: row.JEEApplication[0].reference,
        JEEStatus: row.JEEApplication[0].status,
      };
    }

    let entrancePayments = {
      ...jee,
      AEEPayments: row.EntrancePayments.reduce((acc, txn) => {
        if (acc !== "") {
          acc += ", \n";
        }
        return (
          acc +
          `A. Desc : ${txn.description} B. Amount : ${txn.amount} C. TxnId: ${txn.txnid} D. Ref: ${txn.reference} E. Status: ${txn.status}`
        );
      }, ""),
    };

    let jeePayments = {
      ...entrancePayments,
      JEEPayments: row.JEEPayments.reduce((acc, txn) => {
        if (acc !== "") {
          acc += ", ";
        }
        return (
          acc +
          `A. Desc : ${txn.description} B. Amount : ${txn.amount} C. TxnId: ${txn.txnid} D. Ref: ${txn.reference} E. Status: ${txn.status} \n`
        );
      }, ""),
    };

    let totalData = { ...jeePayments };

    return totalData;
  });

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
};

// Get all candidates details w.r.t status : AR
export const getAllCandidatesInfoByStatus = async (req, res) => {
  // Get status value
  const { status } = req.params;

  // Convert status value to boolean
  const isStatusTrue = status === "true";

  // Get isOMR value
  const { isOMR = "false" } = req.params;
  // Convert status value to boolean
  const isOMRTrue = isOMR === "true";

  let candidates = [];

  const allCandidates = await prisma.candidate.findMany({
    where: {
      Onboarding: {
        status: isStatusTrue,
      },
      isOMR: isOMRTrue,
    },

    include: {
      state: true,
      Onboarding: true,
      ParentInfo: true,
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      /* Gender: row.gender ? row.gender.name : null,*/
      Email: row.email,
      Phone: row.phone,
      State: row.state ? row.state.name : null,
      ParentName: row.ParentInfo ? row.ParentInfo.fullname : null,
      ParentEmail: row.ParentInfo ? row.ParentInfo.email : null,
      ParentPhone: row.ParentInfo ? row.ParentInfo.phone : null,
    };

    return basic;
  });

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
};

// Get applied candidates details : AR
export const getAllAppliedCandidatesInfo = async (req, res) => {
  console.log("In getAllCandidatesInfo");

  let candidates = [];

  // Get isOMR value
  const { isOMR = "false" } = req.params;
  // Convert status value to boolean
  const isOMRTrue = isOMR === "true";

  const allCandidates = await prisma.candidate.findMany({
    where: {
      ExamApplication: {
        some: {
          status: "APPLIED",
        },
      },
      isOMR: isOMRTrue,
    },

    include: {
      state: true,
      Onboarding: true,
      ParentInfo: true,
      ExamApplication: true,
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      /* Gender: row.gender ? row.gender.name : null,*/
      Email: row.email,
      Phone: row.phone,
      State: row.state ? row.state.name : null,
      ParentName: row.ParentInfo ? row.ParentInfo.fullname : null,
      ParentEmail: row.ParentInfo ? row.ParentInfo.email : null,
      ParentPhone: row.ParentInfo ? row.ParentInfo.phone : null,
    };

    return basic;
  });

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
};

// Get  Datewise Candidates Count
export const getDateWiseCandidatesCount = async (req, res) => {
  try {
    const { fromDate, toDate } = req.params;

    const candidateCounts = await prisma.candidate.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const onboardingCounts = await prisma.onboarding.groupBy({
      by: ["createdAt"],
      where: {
        status: true,
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const examApplicationCounts = await prisma.examApplication.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const registrationCounts = await prisma.registration.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      _count: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const dateMap = new Map();

    const updateCounts = (date, countKey, count) => {
      const formattedDate = new Date(date).toLocaleDateString("en-GB"); // Format date to dd-mm-yyyy
      const entry = dateMap.get(formattedDate) || {
        Date: formattedDate,
        SignedUp: 0,
        ProfileCompleted: 0,
        Applied: 0,
        Registered: 0,
      };
      entry[countKey] += count;
      dateMap.set(formattedDate, entry);
    };

    candidateCounts.forEach((candidateEntry) => {
      updateCounts(
        candidateEntry.createdAt.toISOString().split("T")[0],
        "SignedUp",
        candidateEntry._count.createdAt
      );
    });

    onboardingCounts.forEach((onboardingEntry) => {
      updateCounts(
        onboardingEntry.createdAt.toISOString().split("T")[0],
        "ProfileCompleted",
        onboardingEntry._count.createdAt
      );
    });

    examApplicationCounts.forEach((examApplicationEntry) => {
      updateCounts(
        examApplicationEntry.createdAt.toISOString().split("T")[0],
        "Applied",
        examApplicationEntry._count.createdAt
      );
    });

    registrationCounts.forEach((registrationEntry) => {
      updateCounts(
        registrationEntry.createdAt.toISOString().split("T")[0],
        "Registered",
        registrationEntry._count.createdAt
      );
    });

    const formatted = Array.from(dateMap.values());

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formatted);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=excel.xlsx");
    res.end(XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* OMR Candidates Section*/

// Get applied Pending details : AR
export const getOMRPendingList = async (req, res) => {
  console.log("In getOMRPendingList");

  let candidates = [];

  const allCandidates = await prisma.oMRMigrate.findMany({
    where: {
      candidate: null,
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      RegistrationNo: row.registrationNo,
      Phone: row.phone,
    };

    return basic;
  });

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
};

// Get applied Pending details : AR
export const getOMRDuplicateList = async (req, res) => {
  console.log("In getOMRDuplicateList");

  let candidates = [];

  const allCandidates = await prisma.oMRMigrate.findMany({
    where: {
      comment: "Candidate already exists",
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      RegistrationNo: row.registrationNo,
      Phone: row.phone,
    };

    return basic;
  });

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
};

// Get applied Onboarded details : AR
export const getOMROnboardedList = async (req, res) => {
  console.log("In getAllOMRCandidatesList");

  let candidates = [];

  const allCandidates = await prisma.candidate.findMany({
    where: {
      Onboarding: {
        status: true,
      },
      isOMR: true,
    },

    include: {
      state: true,
      Onboarding: true,
      ExamApplication: true,
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.fullname,
      Email: row.email,
      Phone: row.phone,
    };

    return basic;
  });

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
};

// Get applied slot booked details : AR
export const getOMRBookedList = async (req, res) => {
  console.log("In getOMRBookedList");

  let candidates = [];

  let allCandidates = await prisma.slot.findMany({
    where: {
      registration: {
        examapplication: {
          candidate: {
            isOMR: true,
          },
        },
      },
    },
    include: {
      registration: {
        include: {
          examapplication: {
            include: {
              candidate: true,
            },
          },
        },
      },
    },
  });

  const formatted = allCandidates.map((row) => {
    let basic = {
      Name: row.registration.examapplication.candidate.fullname,
      Email: row.registration.examapplication.candidate.email,
      Phone: row.registration.examapplication.candidate.phone,
      City: row.selectedCityCode,
      RegistrationNo: row.registrationNo,
      ExamDate: row.examDate,
      ExamTime: row.examTime,
      ExamMode: row.examMode,
    };

    return basic;
  });

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
};

// Get applied slot not booked details : AR
export const getOMRNotBookedList = async (req, res) => {
  console.log("In getOMRNotBookedList");

  let candidates = [];

  let queryString = Prisma.sql`SELECT C.fullname,C.email,C.phone,R."registrationNo" FROM "Registration" R
  LEFT JOIN "ExamApplication" E on R."examapplicationId" = E.id
  LEFT JOIN "Candidate" C on E."candidateId" = C.id
  WHERE C."isOMR" = true  AND R."registrationNo" NOT IN ( SELECT "registrationNo" FROM "Slot")`;

  const candidateCounts = await prisma.$queryRaw(queryString);

  const allCandidates = candidateCounts as any[];

  console.log("In allCandidates", allCandidates);
  // Check if allCandidates is an array
  if (Array.isArray(allCandidates)) {
    const formatted = allCandidates.map((row) => {
      let basic = {
        Name: row.fullname,
        Email: row.email,
        Phone: row.phone,
        RegistrationNo: row.registrationNo,
      };

      return basic;
    });

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
};

// Get OMR Statewise lsit
export const getStateOMRCandidates = async (req, res) => {
  let candidates = [];

  let queryString = Prisma.sql` WITH CandidateCounts AS (
    SELECT S."name" as state, count(*) as count
    FROM "Candidate" C
    LEFT JOIN "State" S ON C."stateId" = S.id
    WHERE C."isOMR" = true
    GROUP BY S."name"
),

OMRMigrateCounts AS (
    SELECT ST."name" as state, count(*) as countpend
    FROM "OMRMigrate" O
    LEFT JOIN "State" ST ON O."state" = ST.code
    GROUP BY ST."name"
)

SELECT COALESCE(C.state, O.state) as state, COALESCE(C.count, 0) as count, COALESCE(O.countpend, 0) as countpend
FROM CandidateCounts C
FULL OUTER JOIN OMRMigrateCounts O ON C.state = O.state
ORDER BY COALESCE(C.state, O.state);
`;

  const candidateCounts = await prisma.$queryRaw(queryString);

  const allCandidates = candidateCounts as any[];

  // Check if allCandidates is an array
  if (Array.isArray(allCandidates)) {
    const formatted = allCandidates.map((row) => {
      let basic = {
        State: row.state,
        AppliedCount: Number(row.count),
        PendingCount: Number(row.countpend),
      };

      return basic;
    });

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
};

// Get OMR Datewise lsit
export const getDateOMRCandidates = async (req, res) => {
  let candidates = [];
  // Get date values
  const { fromDate, toDate } = req.params;

  const allCandidates = await prisma.candidate.groupBy({
    by: ["createdAt"],
    where: {
      isOMR: true,
      createdAt: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    },
    _count: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date and sum up the counts
  const groupedByDate = allCandidates.reduce((result, entry) => {
    const date = entry.createdAt.toISOString().split("T")[0];
    result[date] = (result[date] || 0) + entry._count.createdAt;
    return result;
  }, {});

  // Format the result as an array of objects
  const formatted = Object.keys(groupedByDate).map((date) => ({
    Date: date,
    CandidateCount: groupedByDate[date],
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
};
