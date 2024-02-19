import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getExamRegisteredReport = async (req, res) => {
  try {
    const resultRows = await prisma.$queryRaw`
    SELECT
        ent.name AS entrance_name,
        e.id AS exam_id,
        e.description AS exam_description,
 	COUNT(ea.id) AS exam_application_count,
        COUNT(reg.id) AS registration_count
    FROM "Exam" e
    LEFT JOIN "Entrance" ent ON e."entranceId" = ent.id
    LEFT JOIN "ExamApplication" ea ON e.id = ea."examId"
    LEFT JOIN "Registration" reg ON ea.id = reg."examapplicationId"
    GROUP BY ent.name, e.id, e.description;
    `;

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      entrance: row.entrance_name,
      examId: row.exam_id,
      exam: row.exam_description,
      applied:Number(row.exam_application_count),
      registered: Number(row.registration_count),
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};


export const getAEEEJEECount = async (req, res) => {
  try {
    const resultRows = await prisma.$queryRaw`
    SELECT
    (SELECT COUNT(*) FROM "ExamApplication" WHERE status = 'REGISTERED') AS aeecount, 
    (SELECT COUNT(*) FROM "ApplicationJEE" A 
     INNER JOIN "ExamApplication" E ON E.id = A."examapplicationId"
     WHERE A."jee" = true AND E.status = 'REGISTERED') AS aeejeecount,
   (SELECT COUNT(*) FROM "JEEApplication" WHERE status = 'REGISTERED') AS jeecount,
    (SELECT COUNT(*) FROM "ExamApplication" WHERE status = 'REGISTERED') + (SELECT COUNT(*) FROM "JEEApplication" WHERE status = 'REGISTERED') AS totalcount,

    (SELECT COUNT(*) FROM "ExamApplication" WHERE status = 'APPLIED') AS aeecountapplied, 
    (SELECT COUNT(*) FROM "ApplicationJEE" A 
     INNER JOIN "ExamApplication" E ON E.id = A."examapplicationId"
     WHERE A."jee" = true AND E.status = 'APPLIED') AS aeejeecountapplied,
   (SELECT COUNT(*) FROM "JEEApplication" WHERE status != 'REGISTERED') AS jeecountapplied,
    (SELECT COUNT(*) FROM "ExamApplication" WHERE status = 'APPLIED') + (SELECT COUNT(*) FROM "JEEApplication" WHERE status != 'REGISTERED') AS totalcountapplied;`;

    const resultArr = resultRows as any[];

    // Convert BigInt to regular numbers
    const formattedCounts = resultArr.map((row) => ({
      aeecount: Number(row.aeecount),
      jeecount: Number(row.jeecount),
      aeejeecount: Number(row.aeejeecount),
      totalcount: Number(row.totalcount), 
      aeecountapplied: Number(row.aeecountapplied),
      jeecountapplied: Number(row.jeecountapplied),
      aeejeecountapplied: Number(row.aeejeecountapplied),
      totalcountapplied: Number(row.totalcountapplied),     
    }));

    return res.json(formattedCounts);
  } catch (error) {
    console.log(error);
    throw new BadRequestError("Request cannot be processed");
  }
};;
