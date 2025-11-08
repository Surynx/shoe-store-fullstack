import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile_picture:{
        type:String
    },
    phone:{
        type:Number
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