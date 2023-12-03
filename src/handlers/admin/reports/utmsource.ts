import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";
import XLSX from "xlsx";

export const getUTMReportBySource = async (req, res) => {
  const { download } = req.query;
  const { entranceId, examId, utmSource } = req.body;
  let queryString = Prisma.sql``;
   if (entranceId && examId) {
    queryString = Prisma.sql`
      SELECT st.name as state_name,
          COUNT(DISTINCT cd.id) AS candidate_count,
          SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
          COUNT(DISTINCT CASE WHEN ex."entranceId" = ${entranceId} THEN ea.id ELSE NULL END) AS exam_application_count,
          COUNT(reg.id) AS registration_count
      FROM "Utm" ut
      LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id
      LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
      INNER JOIN "State" st ON st."id" = cd."stateId"
      LEFT JOIN "ExamApplication" ea ON cd.id = ea."candidateId" AND ea."examId" = ${examId}
      LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
      LEFT JOIN "Exam" ex ON ex."entranceId" = ${entranceId}
      GROUP BY state_name;
        `;   
    
        if (utmSource) {
        
            queryString = Prisma.sql`
            SELECT st.name as state_name,
                COUNT(DISTINCT cd.id) AS candidate_count,
                SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
                COUNT(DISTINCT CASE WHEN ex."entranceId" = ${entranceId} THEN ea.id ELSE NULL END) AS exam_application_count,
                COUNT(reg.id) AS registration_count
            FROM "Utm" ut
            LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id AND ut."utm_source" = ${utmSource}
            LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
            INNER JOIN "State" st ON st."id" = cd."stateId"
            LEFT JOIN "ExamApplication" ea ON cd.id = ea."candidateId" AND ea."examId" = ${examId}
            LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
            LEFT JOIN "Exam" ex ON ex."entranceId" = ${entranceId}
            GROUP BY state_name;
              `;

        }

  }

  console.log(queryString);

  try {
    const utmCounts = await prisma.$queryRaw(queryString);

    const resultArr = utmCounts as any[];

    console.log(resultArr);

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      StateName:row.state_name,
      SignedUp: Number(row.candidate_count),
      ProfileUpdated: Number(row.true_count),
      Applied :
        row.exam_application_count != null
          ? Number(row.exam_application_count)
          : null,
      Registered:
        row.registration_count != null ? Number(row.registration_count) : null,
    }));

    if (download) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add a worksheet to the workbook
      const worksheet = XLSX.utils.json_to_sheet(formattedCounts);

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
    } else {
    
    return res.json(formattedCounts);
  }
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
