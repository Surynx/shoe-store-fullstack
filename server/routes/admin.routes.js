import express from "express";
import { addAdmin, blockUser, fetchUsers, verifyAdmin } from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/multer.js";
import { addcategory, editCategory, fetchCategory } from "../controller/category.controller.js";
import { addBrand, editBrand, fetchBrands } from "../controller/brand.controller.js";
import { addProduct, editProduct, fetchProduct } from "../controller/product.controller.js";
import { addVariant, fetchVariant, removeVariant, updateVariant } from "../controller/variant.controller.js";
import ROUTES from "../constants/routes.constant.js";

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


export default route;
