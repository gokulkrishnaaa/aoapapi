export const currentAdminUser = (req, res) => {
  let currentUser = req.currentUser;
  if (currentUser) {
    currentUser = currentUser.canadmin ? currentUser : null;
  }
  res.send({ currentUser });
};
