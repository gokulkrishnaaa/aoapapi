import { Prisma } from "@prisma/client";
import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";
import XLSX from "xlsx";

export const getExamCityReport = async (req, res) => {
  const { download } = req.query;
  const { examId, showBy } = req.body;

  console.log("Show By", showBy);
  let cityRowNumber = 0;

  switch (showBy) {
    case "city1":
      cityRowNumber = 1;
      break;
    case "city2":
      cityRowNumber = 2;
      break;
    case "city3":
      cityRowNumber = 3;
      break;
    default:
      break;
  }

  let queryString;

  if (showBy != "state") {
    queryString = Prisma.sql`
    WITH RankedCities AS (
    SELECT
        c.name AS locationName,
        ROW_NUMBER() OVER (PARTITION BY ea.id ORDER BY ac.id) AS rowNumber
    FROM "ExamApplication" ea
    LEFT JOIN "ApplicationCities" ac ON ea.id = ac."examapplicationId"
    LEFT JOIN "ExamCity" ec ON ac."examcityId" = ec.id
    LEFT JOIN "City" c ON ec."cityId" = c.id
    WHERE ea."examId" = ${examId} AND c.name IS NOT NULL
    )
    SELECT locationName, COUNT(*) AS locationCount
    FROM RankedCities
    WHERE rowNumber = ${cityRowNumber}
    GROUP BY locationName;
      `;
  } else {
    queryString = Prisma.sql`
    WITH RankedCities AS (
        SELECT
          s.name AS locationName,
          ROW_NUMBER() OVER (PARTITION BY ea.id ORDER BY ac.id) AS rowNumber
        FROM "ExamApplication" ea
        LEFT JOIN "ApplicationCities" ac ON ea.id = ac."examapplicationId"
        LEFT JOIN "ExamCity" ec ON ac."examcityId" = ec.id
        LEFT JOIN "City" c ON ec."cityId" = c.id
        LEFT JOIN "District" d ON c."districtId" = d.id
        LEFT JOIN "State" s ON d."stateId" = s.id
        WHERE ea."examId" = ${examId} AND s.name IS NOT NULL
      )
      SELECT locationName, COUNT(*) AS locationCount
      FROM RankedCities
      GROUP BY locationName;
      `;
  }

  try {
    const resultRows = await prisma.$queryRaw(queryString);

    const resultArr = resultRows as any[];

    console.log("result arr", resultArr);

    // Convert BigInt to regular numbers
    const formatted = resultArr.map((row) => ({
      Location: row.locationname,
      Count: Number(row.locationcount),
    }));

    if (download) {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add a worksheet to the workbook
      const worksheet = XLSX.utils.json_to_sheet(formatted);

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
      return res.json(formatted);
    }
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};
