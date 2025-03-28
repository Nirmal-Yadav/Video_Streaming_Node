import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //  err, req,res,next
  res.status(200).json({ message: "Ok" });
});

export { registerUser };
