export const currentCounsellorUser = (req, res) => {
  let currentUser = req.currentUser;
  if (currentUser) {
    currentUser = currentUser.role === "counsellor" ? currentUser : null;
  }
  res.send({ currentUser });
};
