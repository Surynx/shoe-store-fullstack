import mongoose, { Schema } from "mongoose";

const offerSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum: ["percentage","flat"],
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    apply_for:{
        type:String,
        enum: ["category","product"],
        required:true
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    category_id:{
        type:mongoose.Schema.ObjectId,
        ref:"categories",
        default:null
    },
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:"products",
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Offer= mongoose.model("offers",offerSchema);

export default Offer;