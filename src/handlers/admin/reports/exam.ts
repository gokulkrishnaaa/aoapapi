import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getExamRegisteredReport = async (req, res) => {
  try {
    const resultRows = await prisma.$queryRaw`
    SELECT
        ent.name AS entrance_name,
        e.id AS exam_id,
        e.description AS exam_description,
        COUNT(r.id) AS registration_count
    FROM "Exam" e
    LEFT JOIN "Entrance" ent ON e."entranceId" = ent.id
    LEFT JOIN "Registration" r ON e.id = r."examId"
    GROUP BY ent.name, e.id, e.description;
    `;

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      entrance: row.entrance_name,
      examId: row.exam_id,
      exam: row.exam_description,
      registered: Number(row.registration_count),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
