import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getExamCityReport = async (req, res) => {
  const { examId } = req.body;
  let queryString = Prisma.sql`
    SELECT c.name AS cityName, COUNT(*) AS cityCount
    FROM "ExamApplication" ea
    LEFT JOIN "ApplicationCities" ac ON ea.id = ac."examapplicationId"
    LEFT JOIN "ExamCity" ec ON ac."examcityId" = ec.id
    LEFT JOIN "City" c ON ec."cityId" = c.id
    WHERE ac.id = (
    SELECT MIN(ac2.id)
    FROM "ApplicationCities" ac2
    WHERE ac2."examapplicationId" = ac."examapplicationId"
    )
    AND ea."examId" = ${examId}
    GROUP BY c.name;
      `;

  try {
    const resultRows = await prisma.$queryRaw(queryString);

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      cityname: row.cityname,
      count: Number(row.citycount),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
