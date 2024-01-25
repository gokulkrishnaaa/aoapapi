import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";

export const getAllNonScholarshipReport = async (req, res) => {
    try{
      const resultRows = await prisma.$queryRaw`  
      SELECT COUNT(*) as totalcount FROM "NonScholarshipApplication" WHERE status = 'APPLIED' `;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        totalcount: Number(row.totalcount),   
      }));
  
      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  };


export const getBranchNonSchReport = async (req, res) => {
    try{
      const resultRows = await prisma.$queryRaw`  
      SELECT
      b.id AS branch_id,
      b.name AS branch_name,
      COUNT(nsa.id) AS application_count
      FROM
      "Branch" b
      LEFT JOIN "Programmes" p ON b.id = p."branchId"
      LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id =
      nsap."programmesId"
      LEFT JOIN "NonScholarshipApplication" nsa ON
      nsap."nonscholarshipapplicationId" = nsa.id
      GROUP BY
      b.id
      ORDER BY
      b.name; `;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.branch_name,
        totalcount: Number(row.application_count),   
      }));
  
      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  };

  export const getProgramNonSchReport = async (req, res) => {
    try{
      const resultRows = await prisma.$queryRaw` 
      SELECT 
      p.id AS programme_id,
      p.name AS programme_name,
      COUNT(nsa.id) AS application_count
      FROM
      "Programmes" p
      LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id =
      nsap."programmesId"
      LEFT JOIN "NonScholarshipApplication" nsa ON
      nsap."nonscholarshipapplicationId" = nsa.id
      GROUP BY
      p.id
      ORDER BY
      p.name;`;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.programme_name,
        totalcount: Number(row.application_count),   
      }));
  
      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  };
  
  export const getCampusNonSchReport = async (req, res) => {
    try{
      const resultRows = await prisma.$queryRaw`  
      SELECT
      c.id AS campus_id,
      c.name AS campus_name,
      COUNT(nsa.id) AS application_count
      FROM
      "Campus" c
      LEFT JOIN "Programmes" p ON c.id = p."campusId"
      LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id =
      nsap."programmesId"
      LEFT JOIN "NonScholarshipApplication" nsa ON
      nsap."nonscholarshipapplicationId" = nsa.id
      GROUP BY
      c.id
      ORDER BY
      c.name;`;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.campus_name,
        totalcount: Number(row.application_count),   
      }));
    
      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  };


