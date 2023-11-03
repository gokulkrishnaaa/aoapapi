import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getDistrictWiseReport = async (req, res) => {
  const stateId = parseInt(req.params.stateId);

  if (!stateId) {
    throw new BadRequestError("Input is invalid");
  }
  try {
    const resultRows = await prisma.$queryRaw`
    SELECT d.id AS district_id, d.name AS district_name, COUNT(c.id) AS candidate_count, SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
    FROM "District" d
    LEFT JOIN "Candidate" c ON d.id = c."districtId"
    LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
    WHERE d."stateId" = ${stateId}
    GROUP BY d.id, d.name
    ORDER BY d.name ASC
    `;

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      districtId: row.district_id,
      district: row.district_name,
      signed_count: Number(row.candidate_count),
      profile_created: Number(row.true_count),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
