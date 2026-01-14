import express, { urlencoded } from "express";
import cors from "cors"
import adminRoute from "./routes/admin.routes.js";
import userRoute from "./routes/user.routes.js";
import morgan from "morgan";
import { configDotenv } from "dotenv";
import { connectDb } from "./config/db.config.js";
import passport from "passport";
import "./config/passport.config.js"

const app=express();

configDotenv();

app.use(express.json());
app.use(urlencoded({extended:true}));

app.use("/uploads",express.static("uploads"));
app.use("/sound",express.static("sound"));

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));

app.use(passport.initialize());

app.get("/",(req,res)=>{
    res.send("Welcome to COMET server");
});

app.use("/admin",adminRoute);
app.use("/user",userRoute);

//connect db
connectDb();

//port
const port = process.env.PORT;

// trigger deployment 1
//trigger deployment 2
//trigger deployment 3

app.listen(port,()=>console.log(`server is running at ${port}...✅`));

