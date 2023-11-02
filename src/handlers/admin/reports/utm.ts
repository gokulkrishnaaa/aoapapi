import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getUTMReport = async (req, res) => {
  try {
    const utmCounts = await prisma.$queryRaw`
    SELECT ut.utm_source, ut.utm_medium, ut.utm_campaign,
       COUNT(cd.id) AS candidate_count,
       SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
    FROM "Utm" ut
    LEFT JOIN "Candidate" cd ON ut."candidateId" = cd.id
    LEFT JOIN "Onboarding" ob ON cd.id = ob."candidateId"
    GROUP BY ut.utm_source, ut.utm_medium, ut.utm_campaign;
    `;

    const resultArr = utmCounts as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      utm_source: row.utm_source,
      utm_medium: row.utm_medium,
      utm_campaign: row.utm_campaign,
      signed_count: Number(row.candidate_count),
      profile_created: Number(row.true_count),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
