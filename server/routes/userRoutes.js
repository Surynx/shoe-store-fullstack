import express from "express";
import { generateOtp, googleAuth, register, resetPassword, userLogin, verifyEmail, verifyUser } from "../controller/userController.js";
import passport from "passport";

const route=express.Router();


route.post("/register",register);

route.post("/verify",verifyEmail);

route.patch("/verifyuser",verifyUser);

route.post("/generateotp",generateOtp);

route.post("/login",userLogin);

route.patch("/resetpassword",resetPassword);

route.get("/auth/google",passport.authenticate("google",{scope:["profile","email"],session:false}));

route.get("/auth/google/callback",passport.authenticate("google",{session:false,failureRedirect:"/login"}),googleAuth);

export default route;