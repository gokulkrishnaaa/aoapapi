import prisma from "../../db";

export const getCityForExam = async (req, res) => {
  const entranceId = req.params.entranceid;
  console.log(entranceId);

  const data = await prisma.entrance
    .findUnique({
      where: { id: entranceId },
    })
    .ExamCity();
  res.json(data);
};
