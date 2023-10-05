export const signout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
  });
  res.clearCookie("connect.sid");
  res.send({});
};
