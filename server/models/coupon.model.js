import mongoose from "mongoose";

const couponSchema= new mongoose.Schema({

    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },
    type:{
        type: String,
        enum: ["percentage", "flat"],
        required: true,
    },
    value:{
        type:Number,
        required:true
    },
    min_purchase: {
        type: Number,
        default: 0,
    },
    usageLimit: {
        type: Number,
        default: 1,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    start_date: {
        type: Date,
        required: true,
    },

    end_date: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default:true
    },
    createdFor: {
        type: mongoose.Schema.ObjectId,
        default:null
    }
},{timestamps:true});

const Coupon= mongoose.model("coupons",couponSchema);

export default Coupon;