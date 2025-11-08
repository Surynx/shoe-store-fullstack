import express from "express";
import { configDotenv } from "dotenv";
import { connectDb } from "./config/connectDb.js";
import cors from "cors"
import otpGenerator from "otp-generator"

import adminRoute from "./routes/adminRoutes.js";
import userRoute from "./routes/userRoutes.js";

const app=express();
configDotenv();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Welcome to slick server");
})

app.use("/admin",adminRoute);
app.use("/user",userRoute);

connectDb();


const port = process.env.PORT;
app.listen(port,()=>console.log(`server is running at ${port}...✅`));