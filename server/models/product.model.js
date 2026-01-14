import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    category_id:{
        type:mongoose.Schema.ObjectId,
        require:true,
        ref:"categories"
    },
    brand_id:{
        type:mongoose.Schema.ObjectId,
        require:true,
        ref:"brands"
    },
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Unisex"],
        required:true
    },
    type:{
        type:String,
        default:"",
        trim:true
    },
    description:{
        type:String,
        default:"",
        trim:true
    },
    productImages:{
        type:Array,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const Product= mongoose.model("products",productSchema);

export default Product;