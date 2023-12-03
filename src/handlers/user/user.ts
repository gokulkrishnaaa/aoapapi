import prisma from "../../db";

export const getLoggedUser = async (req, res) => {
  let user;
  let currentUser = req.currentUser;

  if (currentUser) {
    const role = `${currentUser.role ? currentUser.role : ""}`;
    try {
      user = await prisma[role].findUnique({
        where: {
          id: currentUser.id,
        },
      });
    } catch (error) {}
  }
  res.send(user);
};
