import express, { Router } from "express";
import { changePassword, editUserInfo, fetchUserInfo, generateOtpForEmail, generateOtpForPhone, googleAuth, register, resetPassword, updateEmail, userLogin, verifyEmail, verifyPhone, verifyUser } from "../controller/user.controller.js";
import passport from "passport";
import { fetchLatestProduct, fetchProductData, fetchShopProducts } from "../controller/product.controller.js";
import { getAllCategoryForUser } from "../controller/category.controller.js";
import { getAllBrandForUser } from "../controller/brand.controller.js";
import ROUTES from "../constants/routes.constant.js";
import { isUser } from "../middleware/isUser.js";
import upload from "../middleware/multer.js";
import { addNewAddress, editAddress, fetchAddress, removeAddress } from "../controller/address.controller.js";
import { addToCart, countCartItems, decQuantity, fetchCartInfo, incQuantity, removeItemFromCart, validateCartItems } from "../controller/cart.controller.js";
import { getCheckoutData } from "../controller/checkout.controller.js";
import { fetchAllOrders, getOrderDetails, handleCancelItem, handleCancelOrder, placeNewOrder } from "../controller/order.controller.js";

const route=express.Router();


route.post(ROUTES.USER.AUTH.REGISTER,register);

route.post(ROUTES.USER.AUTH.VERIFY,verifyEmail);

route.patch(ROUTES.USER.AUTH.VERIFY_USER,verifyUser);

route.post(ROUTES.USER.AUTH.GENERATE_OTP,generateOtpForEmail);

route.post(ROUTES.USER.AUTH.LOGIN,userLogin);

route.patch(ROUTES.USER.AUTH.RESETPASSWORD,resetPassword);

route.get(ROUTES.USER.AUTH.GOOGLE_AUTH,passport.authenticate("google",{scope:["profile","email","openid"],session:false}));

route.get(ROUTES.USER.AUTH.GOOGLE_CALLBACK,passport.authenticate("google",{session:false,failureRedirect:ROUTES.USER.AUTH.LOGIN}),googleAuth);

route.get(ROUTES.USER.PRODUCT.LATEST,fetchLatestProduct);

route.post(ROUTES.USER.PRODUCT.SHOP,fetchShopProducts);

route.get(ROUTES.USER.CATEGORY.FETCH,getAllCategoryForUser);

route.get(ROUTES.USER.BRAND.FETCH,getAllBrandForUser);

route.get(ROUTES.USER.PRODUCT.FETCH_PRODUCT_DETAIL,fetchProductData);

route.get(ROUTES.USER.ACCOUNT.FETCH,isUser,fetchUserInfo);

route.patch(ROUTES.USER.ACCOUNT.EDIT_INFO,isUser,upload.single("profile_picture"),editUserInfo);

route.post(ROUTES.USER.ACCOUNT.OTP_GENERATE_PHONE,isUser,generateOtpForPhone);

route.patch(ROUTES.USER.ACCOUNT.VERIFY_PHONE,isUser,verifyPhone);

route.post(ROUTES.USER.ACCOUNT.OTP_GENERATE_EMAIL,isUser,generateOtpForEmail);

route.patch(ROUTES.USER.ACCOUNT.VERIFY_EMAIL,isUser,updateEmail);

route.post(ROUTES.USER.ADDRESS.ADD,isUser,addNewAddress);

route.get(ROUTES.USER.ADDRESS.FETCH,isUser,fetchAddress);

route.delete(ROUTES.USER.ADDRESS.DELETE,isUser,removeAddress);

route.put(ROUTES.USER.ADDRESS.UPDATE,isUser,editAddress);

route.patch(ROUTES.USER.ACCOUNT.CHANGE_PASSWORD,isUser,changePassword);

route.post(ROUTES.USER.CART.ADD,isUser,addToCart);

route.get(ROUTES.USER.CART.FETCH,isUser,fetchCartInfo);

route.patch(ROUTES.USER.CART.REMOVE,isUser,removeItemFromCart);

route.patch(ROUTES.USER.CART.QUANTITY_INC,isUser,incQuantity);

route.patch(ROUTES.USER.CART.QUANTITY_DEC,isUser,decQuantity);

route.get(ROUTES.USER.CART.FETCH_COUNT,isUser,countCartItems);

route.get(ROUTES.USER.CART.VALIDATE_CART_ITEMS,isUser,validateCartItems);

route.get(ROUTES.USER.CHECKOUT.FETCH,isUser,getCheckoutData);

route.post(ROUTES.USER.ORDER.ADD,isUser,placeNewOrder);

route.get(ROUTES.USER.ORDER.ORDER_DETAILS,isUser,getOrderDetails);

route.get(ROUTES.USER.ORDER.FETCH,isUser,fetchAllOrders);

route.patch(ROUTES.USER.ORDER.CANCEL_ORDER,isUser,handleCancelOrder);

route.patch(ROUTES.USER.ORDER.CANCEL_ITEM,isUser,handleCancelItem);

export default route;