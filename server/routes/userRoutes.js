import express from "express";
import { protectRoute } from "../middleware/auth.js";
import checkDomain from "../middleware/checkDomain.js"; 
import { checkAuth, login, signup, updateProfile, getUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", checkDomain, signup);
userRoutes.post("/login", login);
userRoutes.put("/updateProfilePicture", protectRoute, updateProfile);
userRoutes.get("/checkAuth", protectRoute, checkAuth);
userRoutes.get("/users", protectRoute, getUsers);

export default userRoutes;