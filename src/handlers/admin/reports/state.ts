import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getStateWiseReport = async (req, res) => {
  try {
    const resultRows = await prisma.$queryRaw`
    SELECT s.id AS state_id, s.name AS state_name, COUNT(c.id) AS candidate_count, SUM(CASE WHEN ob.status = TRUE THEN 1 ELSE 0 END) AS true_count
    FROM "State" s
    LEFT JOIN "Candidate" c ON s.id = c."stateId"
    LEFT JOIN "Onboarding" ob ON c.id = ob."candidateId"
    GROUP BY s.id, s.name
    ORDER BY s.name ASC;
    `;

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      stateId: row.state_id,
      state: row.state_name,
      signed_count: Number(row.candidate_count),
      profile_created: Number(row.true_count),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
