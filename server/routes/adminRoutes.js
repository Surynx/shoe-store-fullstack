import express from "express";
import { addAdmin, addBrand, addcategory, blockUser, editBrand, editCategory, fetchBrands, fetchCategory, fetchUsers, verifyAdmin } from "../controller/adminController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import upload from "../middleware/multer.js";

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


export default route;
