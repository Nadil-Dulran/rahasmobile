import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup a new User
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      bio
    });

    const token = generateToken(newUser._id);

    // Remove password from response
    const userData = newUser.toObject();
    delete userData.password;

    return res.status(201).json({ success: true, userData, token, message: "User Account created successfully" });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Controller for user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const userData = await User.findOne({ email: email.toLowerCase() });

    // If user not found, return generic invalid credentials (do NOT reveal which part was wrong)
    if (!userData) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    }

    const token = generateToken(userData._id);

    // Remove password before returning userData
    const safeUser = userData.toObject();
    delete safeUser.password;

    return res.json({ success: true, userData: safeUser, token, message: "Login Successful" });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Controller to check if user is authenticated (protected route & handled by auth middleware)
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Handle profile update
export const updateProfile = async (req, res) => {
  try {
    console.log("UPDATE PROFILE CALLED. USER ID:", req.user?._id);
    console.log("UPDATE PROFILE BODY:", req.body);

    const fullName = req.body.fullName ?? req.body.fullname;
    const bio = req.body.bio;
    const profilePic = req.body.profilePic ?? req.body.profilepic; // base64 data URL expected

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;

    if (profilePic) {
      console.log("Uploading profile picture to Cloudinary...");
      const uploaded = await cloudinary.uploader.upload(profilePic, {
        folder: "rahas/profile_pics",
        overwrite: true,
      });
      console.log("Cloudinary uploaded:", uploaded.secure_url);
      updateData.profilePic = uploaded.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    console.log("User updated:", !!user);
    return res.json({ success: true, user });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Controller to get all users except the authenticated user
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const unseenMessages = {};

    res.json({ success: true, users, unseenMessages });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};
