import express, { Router } from "express";
import { changePassword, editUserInfo, fetchUserInfo, generateOtpForEmail, generateOtpForPhone, googleAuth, register, resetPassword, updateEmail, userLogin, verifyEmail, verifyPhone, verifyUser } from "../controller/user/user.controller.js";
import passport from "passport";
import { fetchLatestProduct, fetchProductData, fetchShopProducts } from "../controller/user/product.controller.js";
import { getAllCategoryForUser } from "../controller/user/category.controller.js";
import { getAllBrandForUser } from "../controller/user/brand.controller.js";
import ROUTES from "../constants/routes.constant.js";
import { isUser } from "../middleware/isUser.js";
import upload from "../middleware/multer.js";
import { addNewAddress, editAddress, fetchAddress, removeAddress } from "../controller/user/address.controller.js";
import { addToCart, countCartItems, decQuantity, fetchCartInfo, incQuantity, removeItemFromCart, validateCartItems } from "../controller/user/cart.controller.js";
import { getCheckoutData } from "../controller/user/checkout.controller.js";
import { fetchAllOrders, generateInvoice, getOrderDetails, handleCancelItem, handleCancelOrder, handleReturnProduct, placeNewOrder } from "../controller/user/order.controller.js";
import { addProductToWishlist, fetchWishlistInfo, removeItemFromWishlist } from "../controller/user/wishlist.controller.js";
import { createWalletOrder, fetchWalletInfo, verifyWalletPayment } from "../controller/user/wallet.controller.js";
import { createCheckoutOrder, createPaymentRetryOrder, markPaymentFailed, verifyCheckoutPayment } from "../controller/user/payment.controller.js";
import { validateCoupon } from "../controller/user/coupon.controller.js";
import { getDisplayBanner } from "../controller/user/banner.controller.js";

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

route.patch(ROUTES.USER.ORDER.RETURN_ITEM,isUser,handleReturnProduct);

route.get(ROUTES.USER.ORDER.DOWNLOAD_INVOICE,generateInvoice); 

route.post(ROUTES.USER.WISHLIST.ADD,isUser,addProductToWishlist);

route.get(ROUTES.USER.WISHLIST.FETCH,isUser,fetchWishlistInfo);

route.patch(ROUTES.USER.WISHLIST.REMOVE,isUser,removeItemFromWishlist);

route.post(ROUTES.USER.COUPON.VALIDATE,isUser,validateCoupon);

route.post(ROUTES.USER.WALLET.CREATE_ORDER,isUser,createWalletOrder);

route.post(ROUTES.USER.WALLET.ADD_MONEY,isUser,verifyWalletPayment);

route.get(ROUTES.USER.WALLET.FETCH,isUser,fetchWalletInfo);

route.post(ROUTES.USER.PAYMENT.CREATE_ORDER,isUser,createCheckoutOrder);

route.post(ROUTES.USER.PAYMENT.VERIFY_PAYMENT,isUser,verifyCheckoutPayment);

route.post(ROUTES.USER.PAYMENT.FAILED_PAYMENT,isUser,markPaymentFailed);

route.post(ROUTES.USER.PAYMENT.RETRY_PAYMENT,isUser,createPaymentRetryOrder);

route.get(ROUTES.USER.BANNER.FETCH,getDisplayBanner);

export default route;