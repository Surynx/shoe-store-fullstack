import express from "express";
import { addAdmin, blockUser, fetchUsers, verifyAdmin } from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/multer.js";
import { addcategory, editCategory, fetchCategory } from "../controller/category.controller.js";
import { addBrand, editBrand, fetchBrands } from "../controller/brand.controller.js";
import { addProduct, editProduct, fetchProduct } from "../controller/product.controller.js";
import { addVariant, fetchVariant, removeVariant, updateVariant } from "../controller/variant.controller.js";

const route=express.Router();

route.post('/add',addAdmin);

route.post('/verify',verifyAdmin);

route.get('/users',isAdmin,fetchUsers);

route.patch('/block-user',isAdmin,blockUser);

route.post('/category/add',isAdmin,addcategory);

route.get("/category",isAdmin,fetchCategory);

route.patch("/category/edit",isAdmin,editCategory);

route.post("/brand/add",isAdmin,upload.single("logo"),addBrand);

route.get("/brand",isAdmin,fetchBrands);

route.patch("/brand/edit/:id",isAdmin,upload.single("logo"),editBrand);

route.post("/product/add",isAdmin,upload.array("productImages"),addProduct);

route.get("/product",isAdmin,fetchProduct);

route.put("/product/edit/:id",isAdmin,upload.array("productImages"),editProduct);

route.post("/variant/add/:id",isAdmin,addVariant);

route.get("/variant/:id",isAdmin,fetchVariant);

route.delete("/variant/remove/:id",isAdmin,removeVariant);

route.patch("/variant/edit/:id",isAdmin,updateVariant);


export default route;
