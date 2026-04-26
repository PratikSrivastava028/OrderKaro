export const currentUser = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully",
    user: req.user,
  });
};
