import mongoose from "mongoose";

const walletLedgerSchema= mongoose.Schema({
    wallet_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"wallets"
    },
    amount:{
        type:Number,
        required:true,
        default:0
    },
    balance_after:{
        type:Number,
        default:null
    },
    orderId:{
        type:String,
        default:null
    },
    transaction_type:{
        type:String,
        enum:["debited","credited"]
    },
    reason:{
        type:String,
        enum:["Purchase","Cancel Refund","Added to Wallet","Return Refund"]
    },
    status:{
        type:String,
        enum:["pending","completed"]
    },
    razorpay_order_id: {
        type:String,
        default:null
    },
    razorpay_payment_id: {
        type: String,
        default: null
    }
},{timestamps:true});

const WalletLedger= mongoose.model("walletLedgers",walletLedgerSchema);

export default WalletLedger;