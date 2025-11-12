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
        expires:50
    }
});


const Otp=mongoose.model("Otp",OtpSchema);

export default Otp;