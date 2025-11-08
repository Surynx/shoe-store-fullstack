import express from "express";
import { generateOtp, register, resetPassword, userLogin, verifyEmail, verifyUser } from "../controller/userController.js";

const route=express.Router();


route.post("/register",register);

route.post("/verify",verifyEmail);

route.patch("/verifyuser",verifyUser);

route.post("/generateotp",generateOtp);

route.post("/login",userLogin);

route.patch("/resetpassword",resetPassword);

export default route;