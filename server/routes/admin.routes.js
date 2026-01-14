import express from "express";
import { addAdmin, blockUser, fetchUsers, verifyAdmin } from "../controller/admin/admin.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/multer.js";
import { addVariant, fetchVariant, removeVariant, updateVariant } from "../controller/admin/variant.controller.js";
import ROUTES from "../constants/routes.constant.js";
import { addcategory, editCategory, fetchCategory } from "../controller/admin/category.contoller.js";
import { addProduct, editProduct, fetchProduct } from "../controller/admin/product.controller.js";
import { addBrand, editBrand, fetchBrands } from "../controller/admin/brand.controller.js";
import { approveReturn, changeOrderStatus, completeReturn, fetchOrdersInfo, getDetailsOfOrder, rejectReturn } from "../controller/admin/order.controller.js";
import { addNewOfferForCategory, addNewOfferForProduct, getAllOfferOfCategory, getAllOfferOfProduct, removeOffer } from "../controller/admin/offer.controller.js";
import { addNewCoupon, changeCouponStatus, getAllCoupon } from "../controller/admin/coupon.controller.js";
import { getExcelSalesReport, getPdfSalesReport, getSalesOverview, getSalesOverviewCustom, getSalesPageInfo } from "../controller/admin/sales.controller.js";
import { getDashboardInfo } from "../controller/admin/dashboard.controller.js";
import { addBanner, changeBannerPosition, fetchBannerList, removeBanner } from "../controller/admin/banner.controller.js";

const route=express.Router();

route.post(ROUTES.ADMIN.AUTH.ADD,addAdmin);

route.post(ROUTES.ADMIN.AUTH.VERIFY,verifyAdmin);

route.get(ROUTES.ADMIN.USER.FETCH,isAdmin,fetchUsers);

route.patch(ROUTES.ADMIN.USER.BLOCK,isAdmin,blockUser);

route.post(ROUTES.ADMIN.CATEGORY.ADD,isAdmin,addcategory);

route.get(ROUTES.ADMIN.CATEGORY.FETCH,isAdmin,fetchCategory);

route.patch(ROUTES.ADMIN.CATEGORY.EDIT,isAdmin,editCategory);

route.post(ROUTES.ADMIN.BRAND.ADD,isAdmin,upload.single("logo"),addBrand);

route.get(ROUTES.ADMIN.BRAND.FETCH,isAdmin,fetchBrands);

route.patch(ROUTES.ADMIN.BRAND.EDIT,isAdmin,upload.single("logo"),editBrand);

route.post(ROUTES.ADMIN.PRODUCT.ADD,isAdmin,upload.array("productImages"),addProduct);

route.get(ROUTES.ADMIN.PRODUCT.FETCH,isAdmin,fetchProduct);

route.put(ROUTES.ADMIN.PRODUCT.EDIT,isAdmin,upload.array("productImages"),editProduct);

route.post(ROUTES.ADMIN.VARIENTS.ADD,isAdmin,addVariant);

route.get(ROUTES.ADMIN.VARIENTS.FETCH,isAdmin,fetchVariant);

route.delete(ROUTES.ADMIN.VARIENTS.REMOVE,isAdmin,removeVariant);

route.patch(ROUTES.ADMIN.VARIENTS.UPDATE,isAdmin,updateVariant);

route.get(ROUTES.ADMIN.ORDERS.FETCH,isAdmin,fetchOrdersInfo);

route.get(ROUTES.ADMIN.ORDERS.ORDER_DETAILS,isAdmin,getDetailsOfOrder);

route.patch(ROUTES.ADMIN.ORDERS.CHNAGE_STATUS,isAdmin,changeOrderStatus);

route.patch(ROUTES.ADMIN.ORDERS.APPROVE_RETURN,isAdmin,approveReturn);

route.patch(ROUTES.ADMIN.ORDERS.COMPLETE_RETURN,isAdmin,completeReturn);

route.patch(ROUTES.ADMIN.ORDERS.REJECT_RETURN,isAdmin,rejectReturn);

route.post(ROUTES.ADMIN.CATEGORY.ADD_OFFER,isAdmin,addNewOfferForCategory);

route.get(ROUTES.ADMIN.CATEGORY.GET_OFFERS,isAdmin,getAllOfferOfCategory);

route.delete(ROUTES.ADMIN.CATEGORY.REMOVE_OFFER,isAdmin,removeOffer);

route.post(ROUTES.ADMIN.PRODUCT.ADD_OFFER,isAdmin,addNewOfferForProduct);

route.get(ROUTES.ADMIN.PRODUCT.GET_OFFERS,isAdmin,getAllOfferOfProduct);

route.post(ROUTES.ADMIN.COUPON.ADD,isAdmin,addNewCoupon);

route.get(ROUTES.ADMIN.COUPON.GET,isAdmin,getAllCoupon);

route.patch(ROUTES.ADMIN.COUPON.CHNAGE_STATUS,isAdmin,changeCouponStatus);

route.get(ROUTES.ADMIN.SALES.FETCH,isAdmin,getSalesPageInfo);

route.get(ROUTES.ADMIN.SALES.SALES_OVERVIEW,isAdmin,getSalesOverview);

route.get(ROUTES.ADMIN.SALES.SALES_OVERVIEW_CUSTOM,isAdmin,getSalesOverviewCustom);

route.get(ROUTES.ADMIN.SALES.DOWNLOAD_EXCEL_REPORT,isAdmin,getExcelSalesReport);

route.get(ROUTES.ADMIN.SALES.DOWNLOAD_PDF_REPORT,isAdmin,getPdfSalesReport);

route.get(ROUTES.ADMIN.DASHBOARD.FETCH,isAdmin,getDashboardInfo);

route.post(ROUTES.ADMIN.BANNER.ADD,isAdmin,upload.single("image"),addBanner);

route.get(ROUTES.ADMIN.BANNER.FETCH,isAdmin,fetchBannerList);

route.delete(ROUTES.ADMIN.BANNER.REMOVE,isAdmin,removeBanner);

route.patch(ROUTES.ADMIN.BANNER.EDIT,isAdmin,changeBannerPosition);

export default route;
