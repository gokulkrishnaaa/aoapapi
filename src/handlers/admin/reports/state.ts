import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getStateWiseReport = async (req, res) => {
  const { entranceId, examId } = req.body;
  let queryString = Prisma.sql`
  SELECT s.id AS state_id, s.name AS state_name, COUNT(c.id) AS candidate_count, SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
  FROM "State" s
  LEFT JOIN "Candidate" c ON s.id = c."stateId"
  LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
  GROUP BY s.id, s.name
  ORDER BY s.name ASC;
    `;

  if (entranceId) {
    queryString = Prisma.sql`
        SELECT s.id AS state_id, s.name AS state_name,
            COUNT(c.id) AS candidate_count,
            SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
            COUNT(DISTINCT CASE WHEN ex."entranceId" = ${entranceId} THEN ea.id ELSE NULL END) AS exam_application_count,
            COUNT(reg.id) AS registration_count
        FROM "State" s
        LEFT JOIN "Candidate" c ON s.id = c."stateId"
        LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
        LEFT JOIN "ExamApplication" ea ON c.id = ea."candidateId"
        LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
        LEFT JOIN "Exam" ex ON ex."entranceId" = ${entranceId}
        GROUP BY s.id, s.name
        ORDER BY s.name ASC;
        `;
    if (examId) {
      queryString = Prisma.sql`
            SELECT s.id AS state_id, s.name AS state_name,
                COUNT(c.id) AS candidate_count,
                SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
                COUNT(CASE WHEN ea."examId" = ${examId} THEN 1 ELSE NULL END) AS exam_application_count,
                COUNT(reg.id) AS registration_count
            FROM "State" s
            LEFT JOIN "Candidate" c ON s.id = c."stateId"
            LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
            LEFT JOIN "ExamApplication" ea ON c.id = ea."candidateId" AND ea."examId" = ${examId}
            LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
            GROUP BY s.id, s.name
            ORDER BY s.name ASC;
            `;
    }
  }
  try {
    const resultRows = await prisma.$queryRaw(queryString);

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      stateId: row.state_id,
      state: row.state_name,
      signed_count: Number(row.candidate_count),
      profile_created: Number(row.true_count),
      applied:
        row.exam_application_count != null
          ? Number(row.exam_application_count)
          : null,
      registered:
        row.registration_count != null ? Number(row.registration_count) : null,
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
