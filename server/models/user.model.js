import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    profile_picture:{
        type:String
    },
    phone:{
        type:Number,
        unique:true
    },
    gender:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlock:{
        type:Boolean,
        default:false
    },
    google_id:{
        type:String,
        default:null
    },
    referral_code:{
        type:String,
        unique:true
    },
    referred_by:{
        type:mongoose.Schema.ObjectId,
        ref:"users",
        default:null
    }
},{timestamps:true});

const User=mongoose.model("users",userSchema);

export default User;