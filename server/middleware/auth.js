// Function to authenticate user using JWT execute before executing the controller functions

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.headers.token;
        
        console.log("=== PROTECT ROUTE DEBUG ===");
        console.log("Token received:", token ? "Token exists" : "No token");

        if (!token) {
            console.log("ERROR: No token provided");
            return res.json({ success: false, message: "Unauthorized Access - No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Token decoded successfully, userId:", decoded.userId);

        const user = await User.findById(decoded.userId).select("-password");
        console.log("User found:", user ? user.email : "No user");

        if(!user)  return res.json({ success: false, message: "Unauthorized Access - User not found" });
        
        req.user = user;
        next();

    } catch(error){
        console.log("PROTECT ROUTE ERROR:", error.message);
        res.json({ success: false, message: "Unauthorized Access - " + error.message });   
    }

}