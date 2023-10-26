import prisma from "../../db";
import XLSX from "xlsx";

export const importlocation = async (req, res) => {
  if (!req.files || !req.files.excelFile) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const excelFile = req.files.excelFile;

  // Check if the uploaded file is in XLSX format
  if (!excelFile.name.endsWith(".xlsx")) {
    return res
      .status(400)
      .json({ error: "Invalid file format. Please upload an XLSX file." });
  }

  // Use the XLSX library to read the Excel file
  const workbook = XLSX.read(excelFile.data, { type: "buffer" });

  // Assuming the data is in the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  try {
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let stateC = 0;
    let districtC = 0;
    let cityC = 0;

    for (const entry of jsonData) {
      // Check if the state exists, or create it if it doesn't
      if (entry[0]) {
        stateC++;
        const state = await prisma.state.upsert({
          where: { name: entry[0] },
          update: {},
          create: { name: entry[0] },
        });

        if (entry[1]) {
          districtC++;
          // Check if the district exists, or create it if it doesn't
          const district = await prisma.district.upsert({
            where: {
              StateDistrictNameUnique: {
                name: entry[1],
                stateId: state.id,
              },
            },
            update: {},
            create: {
              name: entry[1],
              state: { connect: { id: state.id } },
            },
          });

          if (entry[2]) {
            cityC++;
            // Create the city
            await prisma.city.upsert({
              where: {
                DistrictCityNameUnique: {
                  name: entry[2],
                  districtId: district.id,
                },
              },
              update: {},
              create: {
                name: entry[2],
                district: { connect: { id: district.id } },
              },
            });
          }
        }
      }
    }

    return res.json({ mssg: "success", stateC, districtC, cityC });
  } catch (error) {
    console.log(error);
    return res.json("error");
  }
};
