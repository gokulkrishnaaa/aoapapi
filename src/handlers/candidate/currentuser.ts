export const currentUser = (req, res) => {
  let currentUser = req.currentUser;
  if (currentUser) {
    currentUser = currentUser.role === "candidate" ? currentUser : null;
  }
  res.send({ currentUser });
};
