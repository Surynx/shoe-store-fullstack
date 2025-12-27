import mongoose from "mongoose";

const walletSchema= new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"users"
    },
    balance:{
        type:Number,
        default:0,
        min:0
    },
    hold_balance:{
        type:Number,
        default:0,
        min:0  
    },
    lastTransactionAt: {
      type: Date,
      default: null,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedAttemptAt: {
      type: Date,
      default: null,
    }
},{timestamps:true});

const Wallet= mongoose.model("wallets",walletSchema);

export default Wallet;