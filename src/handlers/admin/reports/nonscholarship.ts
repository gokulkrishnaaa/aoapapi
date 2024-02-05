import prisma from "../../../db";
import { BadRequestError } from "../../../errors/bad-request-error";
import XLSX from "xlsx";

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
      WITH FirstPreference AS (
        SELECT
            nsap."programmesId",
            MIN(nsap."order") AS min_order
        FROM
            "NonSchApplicationProgrammes" nsap
        WHERE
            nsap."order" = 1
        GROUP BY
            nsap."programmesId"
    )
    SELECT
        b.id AS branch_id,
        b.name AS branch_name,
        COUNT(DISTINCT nsa.id) AS application_count
        FROM
        "Branch" b
        LEFT JOIN "Programmes" p ON b.id = p."branchId"
        LEFT JOIN FirstPreference fp ON p.id = fp."programmesId"
        LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id = nsap."programmesId" AND nsap."order" = fp.min_order
        LEFT JOIN "NonScholarshipApplication" nsa ON nsap."nonscholarshipapplicationId" = nsa.id
        WHERE
        nsa.status = 'APPLIED' AND
        fp."programmesId" IS NOT NULL
        GROUP BY
        b.id, b.name
        ORDER BY
        application_count DESC; `;
     
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
      WITH FirstPreference AS (
        SELECT
            nsap."programmesId",
            MIN(nsap."order") AS min_order
        FROM
            "NonSchApplicationProgrammes" nsap
        WHERE
            nsap."order" = 1
        GROUP BY
            nsap."programmesId"
    )
    SELECT
        p.id AS programme_id,
        p.name AS programme_name,
        COUNT(DISTINCT nsa.id) AS application_count
        FROM
        "Programmes" p
        LEFT JOIN FirstPreference fp ON p.id = fp."programmesId"
        LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id = nsap."programmesId" AND nsap."order" = fp.min_order
        LEFT JOIN "NonScholarshipApplication" nsa ON nsap."nonscholarshipapplicationId" = nsa.id
        WHERE
        nsa.status = 'APPLIED' AND
        fp."programmesId" IS NOT NULL
        GROUP BY
        p.id, p.name
        ORDER BY
        application_count DESC; `;
     
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
      WITH FirstPreference AS (
        SELECT
            nsap."programmesId",
            MIN(nsap."order") AS min_order
        FROM
            "NonSchApplicationProgrammes" nsap
        WHERE
            nsap."order" = 1
        GROUP BY
            nsap."programmesId"
    )
    SELECT
        c.id AS campus_id,
        c.name AS campus_name,
        COUNT(DISTINCT nsa.id) AS application_count
        FROM
        "Campus" c
        LEFT JOIN "Programmes" p ON c.id = p."campusId"
        LEFT JOIN FirstPreference fp ON p.id = fp."programmesId"
        LEFT JOIN "NonSchApplicationProgrammes" nsap ON p.id = nsap."programmesId" AND nsap."order" = fp.min_order
        LEFT JOIN "NonScholarshipApplication" nsa ON nsap."nonscholarshipapplicationId" = nsa.id
        WHERE
        nsa.status = 'APPLIED' AND
        fp."programmesId" IS NOT NULL
        GROUP BY
        c.id, c.name
        ORDER BY
        application_count DESC; `;
     
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

  export const getExcelNonSchReport = async (req, res) => {
    
    let excelreport = await prisma.nonScholarshipApplication.findMany({
      
      include: {
        candidate:{
          include:{
            gender:true,
            state: true,
            district: true,
            city: true,
            ParentInfo: true,
            PlusTwoInfo: {
              include: {
                state: true,
              },
            },
            ExamApplication: {
              include:{
                Registration: {
                  select: {
                    registrationNo: true
                  }
                },
              }
            },
            JEEApplication:true,
          }
          
        },
        NonSchApplicationProgrammes:{
          include:{
            programmes:{
              include:{
                campus:true,
                branch:true,
              }
            }
          }
        }
      },
    });
   

    const formatted = excelreport.map((row) => {

      const submittedDate = new Date(row.createdAt);
      const formattedSubmittedDate = `${submittedDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} ${submittedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;

      interface ExamApplication {
        reference: string;
        Registration?: {
          registrationNo: number;
        }[];
      }

      interface JEEApplication {
        reference: string;
      }

      let basic = {
        SubmittedDateAndTime: formattedSubmittedDate,
        Registered_Email: row.candidate.email ? row.candidate.email : null,
        Name: row.candidate.fullname ? row.candidate.fullname : null,
        Gender: row.candidate.gender ? row.candidate.gender.name : null,
        DateOfBirth: new Date(row.candidate.dob).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        Parent_Name: row.candidate.ParentInfo ? row.candidate.ParentInfo.fullname : null,
        District: row.candidate.district.name ? row.candidate.district.name : null,
        State: row.candidate.state ? row.candidate.state.name : null,
        Parent_Number: row.candidate.ParentInfo ? row.candidate.ParentInfo.phone : null,
        Candidate_Number: row.candidate.phone ? row.candidate.phone: null,
        PlusTwoState: row.candidate.PlusTwoInfo
        ? row.candidate.PlusTwoInfo.state
          ? row.candidate.PlusTwoInfo.state.name
          : row.candidate.PlusTwoInfo.otherState
          ? row.candidate.PlusTwoInfo.otherState
          : null
        : null,
        ApplicationNo_AEEE2024: (row.candidate.ExamApplication as ExamApplication[])[0]?.reference ?? null,
        RegistrationNo: (row.candidate.ExamApplication as ExamApplication[])[0]?.Registration[0]?.registrationNo ?? null,
        AppliactionNo_JEEMains2024: (row.candidate.JEEApplication as JEEApplication[])[0]?.reference?? null,
      };

      let preferences = {
        ...basic,
      };

      let campusPreferences = [];
      let branchPreferences = [];

      row.NonSchApplicationProgrammes.slice(0, 5).forEach((appln) => {
        if (appln.programmes.branch && appln.programmes.campus) {         
          const order = appln.order;
          campusPreferences[order - 1] = appln.programmes.campus.name; 
          branchPreferences[order - 1] = appln.programmes.branch.name; 
        }
      });

      for (let i = 0; i < 5; i++) {
        preferences[`Campus_Preference_${i + 1}`] = campusPreferences[i] || null;
      }
      for (let i = 0; i < 5; i++) {
      preferences[`Branch_Preference_${i + 1}`] = branchPreferences[i] || null;
      }

      return {
        ...preferences,
      };
    });
    //   return res.json(formatted);
  
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
  };
