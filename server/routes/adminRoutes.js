import express from "express";
import { addAdmin, verifyAdmin } from "../controller/adminController.js";

const route=express.Router();

route.post('/add',addAdmin);

route.post('/verify',verifyAdmin);


export default route;
