import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getUTMReport = async (req, res) => {
  const { entranceId, examId } = req.body;
  let queryString = Prisma.sql`
    SELECT ut.utm_source, ut.utm_medium, ut.utm_campaign,
       COUNT(cd.id) AS candidate_count,
       SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
    FROM "Utm" ut
    LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id
    LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
    GROUP BY ut.utm_source, ut.utm_medium, ut.utm_campaign;
    `;

  if (entranceId) {
    queryString = Prisma.sql`
      SELECT ut.utm_source, ut.utm_medium, ut.utm_campaign,
          COUNT(DISTINCT cd.id) AS candidate_count,
          SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
          COUNT(DISTINCT CASE WHEN ex."entranceId" = ${entranceId} THEN ea.id ELSE NULL END) AS exam_application_count,
          COUNT(reg.id) AS registration_count
      FROM "Utm" ut
      LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id
      LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
      LEFT JOIN "ExamApplication" ea ON cd.id = ea."candidateId"
      LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
      LEFT JOIN "Exam" ex ON ex."entranceId" = ${entranceId}
      GROUP BY ut.utm_source, ut.utm_medium, ut.utm_campaign;
        `;
    if (examId) {
      queryString = Prisma.sql`
      SELECT ut.utm_source, ut.utm_medium, ut.utm_campaign,
        COUNT(DISTINCT cd.id) AS candidate_count,
        SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count,
        COUNT(CASE WHEN ea."examId" = ${examId} THEN 1 ELSE NULL END) AS exam_application_count,
        COUNT(reg.id) AS registration_count
      FROM "Utm" ut
      LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id
      LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
      LEFT JOIN "ExamApplication" ea ON cd.id = ea."candidateId" AND ea."examId" = ${examId}
      LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
      GROUP BY ut.utm_source, ut.utm_medium, ut.utm_campaign;
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
      utm_source: row.utm_source,
      utm_medium: row.utm_medium,
      utm_campaign: row.utm_campaign,
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
