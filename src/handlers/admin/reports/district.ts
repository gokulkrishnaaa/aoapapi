import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getDistrictWiseReport = async (req, res) => {
  const stateId = parseInt(req.params.stateId);
  const { entranceId, examId } = req.body;

  if (!stateId) {
    throw new BadRequestError("Input is invalid");
  }

  let queryString = Prisma.sql`
  SELECT d.id AS district_id, d.name AS district_name, COUNT(c.id) AS candidate_count, SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
  FROM "District" d
  LEFT JOIN "Candidate" c ON d.id = c."districtId"
  LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
  WHERE d."stateId" = ${stateId}
  GROUP BY d.id, d.name
  ORDER BY d.name ASC
  `;

  if (entranceId) {
    queryString = Prisma.sql`
        SELECT d.id AS district_id, d.name AS district_name,
            COUNT(c.id) AS candidate_count,
            SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
            COUNT(DISTINCT CASE WHEN ex."entranceId" = ${entranceId} THEN ea.id ELSE NULL END) AS exam_application_count,
            COUNT(reg.id) AS registration_count
        FROM "District" d
        LEFT JOIN "Candidate" c ON d.id = c."districtId"
        LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
        LEFT JOIN "ExamApplication" ea ON c.id = ea."candidateId"
        LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
        LEFT JOIN "Exam" ex ON ex."entranceId" = ${entranceId}
        WHERE d."stateId" = ${stateId}
        GROUP BY d.id, d.name
        ORDER BY d.name ASC
        `;
    if (examId) {
      queryString = Prisma.sql`
        SELECT d.id AS district_id, d.name AS district_name,
            COUNT(c.id) AS candidate_count,
            SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
            COUNT(CASE WHEN ea."examId" = ${examId} THEN 1 ELSE NULL END) AS exam_application_count,
            COUNT(reg.id) AS registration_count
        FROM "District" d
        LEFT JOIN "Candidate" c ON d.id = c."districtId"
        LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
        LEFT JOIN "ExamApplication" ea ON c.id = ea."candidateId" AND ea."examId" = ${examId}
        LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
        WHERE d."stateId" = ${stateId}
        GROUP BY d.id, d.name
        ORDER BY d.name ASC
    `;
    }
  }

  try {
    const resultRows = await prisma.$queryRaw(queryString);

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      districtId: row.district_id,
      district: row.district_name,
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
