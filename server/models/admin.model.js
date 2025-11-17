import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});

const Admin=mongoose.model('admins',adminSchema);

export default Admin;