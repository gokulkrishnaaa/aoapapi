
  
import prisma from "../../db";

export const getUtmSource = async (req, res) => {
    const data = req.body;
  
    const sources = await prisma.utm.findMany();
  
    return res.json(sources);
  };