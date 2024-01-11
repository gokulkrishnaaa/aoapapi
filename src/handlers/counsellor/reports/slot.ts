import prisma from "../../../db";
import XLSX from "xlsx";

  export const getSlot = async (req, res) => {
    const examId = req.body.examId; // Assuming examId is passed as a query parameter
    const  download  = req.body.download;
   
  try {
        let slots = await prisma.slot.findMany({
            where: {
                registration: {
                    examId: examId,
                },
            },
            include: {
                registration: {
                    include: {
                        examapplication: {
                            include: {
                                candidate: true,
                            },
                        },
                    },
                },
            },
        });
     
       
        if (download) {

        const formatted = slots.map((row) => ({
           
              Name: row.registration.examapplication.candidate.fullname,
              Email: row.registration.examapplication.candidate.email,
              Phone: row.registration.examapplication.candidate.phone,
              City: row.selectedCityCode,
              RegistrationNo: row.registrationNo,
              ExamDate: row.examDate,
              ExamTime: row.examTime,
              ExamMode: row.examMode ,
             
          
        
           // return basic;
          }));
       
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
          }
else{
        
        return res.json(slots);
}


    } catch (error) {
        console.error("Error fetching slots:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};