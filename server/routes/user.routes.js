import express from "express";
import { generateOtp, googleAuth, register, resetPassword, userLogin, verifyEmail, verifyUser } from "../controller/user.controller.js";
import passport from "passport";
import { fetchLatestProduct, fetchProductData, fetchShopProducts } from "../controller/product.controller.js";
import { getAllCategoryForUser } from "../controller/category.controller.js";
import { getAllBrandForUser } from "../controller/brand.controller.js";
import ROUTES from "../constants/routes.constant.js";

const route=express.Router();


route.post(ROUTES.USER.AUTH.REGISTER,register);

route.post(ROUTES.USER.AUTH.VERIFY,verifyEmail);

route.patch(ROUTES.USER.AUTH.VERIFY_USER,verifyUser);

route.post(ROUTES.USER.AUTH.GENERATE_OTP,generateOtp);

route.post(ROUTES.USER.AUTH.LOGIN,userLogin);

route.patch(ROUTES.USER.AUTH.RESETPASSWORD,resetPassword);

route.get(ROUTES.USER.AUTH.GOOGLE_AUTH,passport.authenticate("google",{scope:["profile","email"],session:false}));

route.get(ROUTES.USER.AUTH.GOOGLE_CALLBACK,passport.authenticate("google",{session:false,failureRedirect:ROUTES.USER.AUTH.LOGIN}),googleAuth);

route.get(ROUTES.USER.PRODUCT.LATEST,fetchLatestProduct);

route.post(ROUTES.USER.PRODUCT.SHOP,fetchShopProducts);

route.get(ROUTES.USER.CATEGORY.FETCH,getAllCategoryForUser);

route.get(ROUTES.USER.BRAND.FETCH,getAllBrandForUser);

route.get(ROUTES.USER.PRODUCT.FETCH_PRODUCT_DETAIL,fetchProductData);

export default route;