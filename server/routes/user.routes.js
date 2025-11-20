import express from "express";
import { generateOtp, googleAuth, register, resetPassword, userLogin, verifyEmail, verifyUser } from "../controller/user.controller.js";
import passport from "passport";
import { fetchLatestProduct, fetchProductData, fetchShopProducts } from "../controller/product.controller.js";
import { getAllCategoryForUser } from "../controller/category.controller.js";
import { getAllBrandForUser } from "../controller/brand.controller.js";

const route=express.Router();


route.post("/register",register);

route.post("/verify",verifyEmail);

route.patch("/verifyuser",verifyUser);

route.post("/generateotp",generateOtp);

route.post("/login",userLogin);

route.patch("/resetpassword",resetPassword);

route.get("/auth/google",passport.authenticate("google",{scope:["profile","email"],session:false}));

route.get("/auth/google/callback",passport.authenticate("google",{session:false,failureRedirect:"/login"}),googleAuth);

route.get("/latest/product",fetchLatestProduct);

route.post("/shop/product",fetchShopProducts);

route.get("/category",getAllCategoryForUser);

route.get("/brand",getAllBrandForUser);

route.get("/product/:id",fetchProductData);

export default route;