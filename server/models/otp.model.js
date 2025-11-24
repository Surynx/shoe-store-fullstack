import mongoose from "mongoose";

const OtpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    code:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60
    }
});


const Otp=mongoose.model("otps",OtpSchema);

export default Otp;