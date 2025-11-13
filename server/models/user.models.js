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
    }
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;