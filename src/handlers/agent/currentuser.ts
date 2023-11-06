export const currentAgentUser = (req, res) => {
  let currentUser = req.currentUser;
  if (currentUser) {
    currentUser = currentUser.role === "agent" ? currentUser : null;
  }
  res.send({ currentUser });
};
