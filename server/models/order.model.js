import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderItemSchema= new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"products"
    },
    variant_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"variants"
    },
    sales_price:{
        type:Number,
        required:true
    },
    original_price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
      type: String,
      enum: ["pending", "confirmed", "shipped", "out_for_delivery", "delivered", "canceled"],
      default: "pending",
    },
    cancelledAt: {
      type:Date
    },
    return_status:{
      type:String,
      enum: ["Requested", "Approved", "Rejected", "Completed"],
    },
    return_reason:{
      type:String,
    },
    return_date:{
      type:Date,
    }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
        type:String,
        default:()=>"ORD-" + nanoid(10)
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["cod", "card", "upi", "wallet"],
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    payment_id: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "out_for_delivery", "delivered", "canceled"],
      default: "pending",
    },
    order_date: {
      type: Date,
      default: Date.now,
    },

    items: [orderItemSchema],

    discount: {
      type: Number,
      default: 0,
    },
    total_amount: {
        type:Number,
        default: 0
    },
    tax: {
        type:Number,
        default: 0
    },
    delivery_charge: {
      type: Number,
      default: 0,
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupons",
      default: null,
    },
    cancelledAt: {
      type:Date
    }
  },

  { timestamps: true }
);

const Order= mongoose.model("orders", orderSchema);

export default Order;