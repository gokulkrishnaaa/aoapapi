import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getCandidatesByUtmSource = async (req, res) => {
  const { source } = req.params;
  const { stateId, districtId } = req.body;

  let whereClause = {
    Utm: {
      utm_source: source,
    },
  };

  if (stateId) {
    whereClause["stateId"] = stateId;
  }

  if (districtId) {
    whereClause["districtId"] = districtId;
  }

  const candidatesWithUtmSource = await prisma.candidate.findMany({
    where: whereClause,
    include: {
      Utm: {
        select: {
          utm_medium: true,
          utm_campaign: true,
        },
      },
      Onboarding: {
        select: {
          status: true,
        },
      },
      state: true,
      district: true,
    },
    orderBy: {
      createdAt: "desc", // Sort by createdAt in descending order
    },
  });
  return res.json(candidatesWithUtmSource);
};

export const getUtmCandidatesByEntrance = async (req, res) => {
  const { source } = req.params;
  const { stateId, districtId, entranceId } = req.body;
  console.log(entranceId);

  let queryString = null;

  if (entranceId) {
    queryString = Prisma.sql`
      SELECT
      u.utm_medium as medium,
      u.utm_campaign as campaign,
      c.id AS candidate_id,
      c.fullname,
      c.email,
      c.phone,
      CASE WHEN ea.id IS NOT NULL THEN true ELSE false END AS applied,
      CASE WHEN r.id IS NOT NULL THEN true ELSE false END AS registered,
      s.id AS state_id,
      s.name AS state_name,
      d.id AS district_id,
      d.name AS district_name
    FROM "Candidate" c
    LEFT JOIN "Utm" u ON c.id = u."candidateId"
    LEFT JOIN "ExamApplication" ea ON c.id = ea."candidateId"
    LEFT JOIN "Exam" e ON ea."examId" = e.id AND e."entranceId" = ${entranceId}
    LEFT JOIN "Registration" r ON e.id = r."examId" AND ea.id = r."examapplicationId"
    LEFT JOIN "State" s ON c."stateId" = s.id
    LEFT JOIN "District" d ON c."districtId" = d.id
    WHERE u.utm_source = ${source}
    ${stateId ? Prisma.sql`AND c."stateId" = ${stateId}` : Prisma.sql``}
    ${
      districtId ? Prisma.sql`AND c."districtId" = ${districtId}` : Prisma.sql``
    }
    ORDER BY c."createdAt" DESC;
            `;
  }

  if (queryString) {
    try {
      const utmCounts = await prisma.$queryRaw(queryString);

      const resultArr = utmCounts as any[];

      console.log(resultArr);

      // Convert BigInt to regular numbers
      const formattedCounts = resultArr.map((row) => ({
        candidate_id: row.candidate_id,
        medium: row.medium,
        campaign: row.campaign,
        fullname: row.fullname,
        email: row.email,
        phone: row.phone,
        applied: row.applied,
        registered: row.registered,
        state_id: row.state_id,
        state_name: row.state_name,
        district_id: row.district_id,
        district_name: row.district_name,
      }));

      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  } else {
    return res.json([]);
  }
};
