import express, { urlencoded } from "express";
import cors from "cors"
import adminRoute from "./routes/adminRoutes.js";
import userRoute from "./routes/userRoutes.js";
import morgan from "morgan";
import { configDotenv } from "dotenv";
import { connectDb } from "./config/connectDb.js";
import passport from "passport";
import "./config/passport.js"

const app=express();

configDotenv();

app.use(express.json());
app.use(urlencoded({extended:true}));

app.use("/uploads",express.static("uploads"));

app.use(cors());
app.use(morgan("dev"));

app.use(passport.initialize());

app.get("/",(req,res)=>{
    res.send("Welcome to slick server");
});

app.use("/admin",adminRoute);
app.use("/user",userRoute);

connectDb();

const port = process.env.PORT;
app.listen(port,()=>console.log(`server is running at ${port}...✅`));

