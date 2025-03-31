import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const getUserFromToken = async (token) => {
  try {
    if (!token) return null; // No token provided

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decoded, "decooo");

    // Find the user in the database
    const user = await User.findById(decoded._id).select("-password"); // Exclude password

    console.log(user, "uuu");

    return user || null;
  } catch (error) {
    console.error("❌ Invalid or expired token:", error.message);
    return null; // Invalid token
  }
};
