import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
      required: true,
    },

    line1: {
      type: String,
      required: true,
      trim: true,
    },

    line2: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pin_code: {
      type: Number,
      required: true,
      min: 100000,
      max: 999999, 
    },

    phone: {
      type: Number,
      required: true,
      min: 6000000000,
      max: 9999999999, 
    },

    isDefault:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

const Address= mongoose.model("address", addressSchema);

export default Address;
