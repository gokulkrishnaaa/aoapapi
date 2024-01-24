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
        SELECT B.name as name, COUNT(*) AS appcount
        FROM "NonScholarshipApplication" NA
        LEFT JOIN "NonSchApplicationProgrammes" NP ON NA.id = NP."nonscholarshipapplicationId"
        LEFT JOIN "Programmes" P ON P.id = NP."programmesId"
        LEFT JOIN "Branch" B ON B.id = P."branchId"
        WHERE NA.status = 'APPLIED'
        GROUP BY B.name
        ORDER BY B.name; `;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.name,
        totalcount: Number(row.appcount),   
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
        SELECT P.name as name, COUNT(*) AS appcount
        FROM "NonScholarshipApplication" NA
        LEFT JOIN "NonSchApplicationProgrammes" NP ON NA.id = NP."nonscholarshipapplicationId"
        INNER JOIN "Programmes" P ON P.id = NP."programmesId"
        WHERE NA.status = 'APPLIED'
        GROUP BY P.name 
        ORDER BY P.name;`;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.name,
        totalcount: Number(row.appcount),   
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
      SELECT C.name as name, COUNT(*) AS appcount
      FROM "NonScholarshipApplication" NA
      LEFT JOIN "NonSchApplicationProgrammes" NP ON NA.id = NP."nonscholarshipapplicationId"
      LEFT JOIN "Programmes" P ON P.id = NP."programmesId"
      LEFT JOIN "Campus" C ON C.id = P."campusId"
      WHERE NA.status = 'APPLIED'
      GROUP BY C.name
      ORDER BY C.name;`;
     
      const resultArr = resultRows as any[];
      const formattedCounts = resultArr.map((row) => ({
        name: row.name,
        totalcount: Number(row.appcount),   
      }));
    
      return res.json(formattedCounts);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Request cannot be processed");
    }
  };


