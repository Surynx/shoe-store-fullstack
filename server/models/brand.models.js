import mongoose from "mongoose";

const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    logo:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const Brand = mongoose.model("Brand",brandSchema);

export default Brand;