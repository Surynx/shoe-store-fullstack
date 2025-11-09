import express from "express";
import { addAdmin, blockUser, fetchUsers, verifyAdmin } from "../controller/adminController.js";
import { isAdmin } from "../middleware/isAdmin.js";

const route=express.Router();

route.post('/add',addAdmin);

route.post('/verify',verifyAdmin);

route.get('/users',isAdmin,fetchUsers);

route.patch('/block-user',blockUser);


export default route;
