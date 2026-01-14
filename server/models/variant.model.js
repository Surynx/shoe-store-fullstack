import mongoose from "mongoose";

const variantSchema= new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"products"
    },
    size:{
        type:String,
        required:true,
        immutable: true
    },
    stock:{
        type:Number,
        required:true
    },
    original_price:{
        type:Number,
        required:true
    },
    sales_price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Variant= mongoose.model("variants",variantSchema);

export default Variant;