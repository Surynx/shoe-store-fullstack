import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    description:{
        type:String,
        default:"Nothing",
        trim:true
    },
    status:{
        type:Boolean,
        default:true
    },
    offerId:{
        type:mongoose.Schema.ObjectId,
        ref:"offers"
    }
},{timestamps:true});

const Category = mongoose.model("categories",categorySchema);

export default Category;