export const currentAdminUser = (req, res) => {
  let currentUser = req.currentUser;
  if (currentUser) {
    currentUser = currentUser.role === "admin" ? currentUser : null;
  }
  res.send({ currentUser });
};
