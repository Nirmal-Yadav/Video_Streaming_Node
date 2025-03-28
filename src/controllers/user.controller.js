import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //  err, req,res,next
  //   res.status(200).json({ message: "Ok" });

  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    // User can be directly contact to mongodb
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req?.files?.avatar[0]?.path; // multer gives us files access
  // in first prop give obj which gives access to path

  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //  string  , what is not required is mentioned remove password and refershtoken
  );

  if (!createdUser) {
    throw new ApiError(500, "registering user error");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user register succesfully"));
});

export { registerUser };

// avatar at [0 {
//     avatar: [{ fieldname: "avatar", path: "uploads/avatar123.jpg", ... }],
//     coverImage: [{ fieldname: "coverImage", path: "uploads/cover456.jpg", ... }]
//   }
//   ]
