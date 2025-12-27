import razorpay from "../../config/razorpay.config.js";
import STATUS from "../../constants/status.constant.js";
import User from "../../models/user.model.js";
import WalletLedger from "../../models/wallet-ledger.model.js";
import Wallet from "../../models/wallet.model.js";
import crypto from "crypto";

const createWalletOrder= async (req,res) => {
    
    try {
        
        const {amount}= req.body;

        const email= req.email;

        const user = await User.findOne({ email });

        let wallet= await Wallet.findOne({user_id:user._id});

        if(!wallet) {
            wallet= await Wallet.create({

                user_id:user._id,
                balance:0,
                hold_balance:0
            });
        }
        
        const order= await razorpay.orders.create({
            amount:amount*100,
            currency:"INR",
            receipt:`wallet-${Date.now()}`,
            payment_capture:1
        });

        await WalletLedger.create({
            wallet_id:wallet._id,
            amount,
            transaction_type:"credited",
            reason:"Added to Wallet",
            status:"pending",
            razorpay_order_id:order.id
        });

        res.status(STATUS.SUCCESS.OK).send({ success:true,order })

    } catch (error) {
        
        console.log("Erron in wallet create order",error);
    }
}

const verifyWalletPayment= async (req,res) => {
    
    try{

        const { razorpay_order_id,razorpay_payment_id,razorpay_signature } = req.body;
        
        const body= `${razorpay_order_id}|${razorpay_payment_id}`;

        const signature= crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if( signature != razorpay_signature ) {

            return res.status(STATUS.ERROR.BAD_REQUEST).sent({ success: false, message: "Payment verification failed" });
        }

        const ledger= await WalletLedger.findOne({ razorpay_order_id,status: "pending",transaction_type: "credited",reason: "Added to Wallet" });

        const wallet= await Wallet.findById(ledger.wallet_id);

        wallet.balance += ledger.amount;
        wallet.lastTransactionAt = new Date();
        await wallet.save();

        ledger.status = "completed"
        ledger.razorpay_payment_id = razorpay_payment_id
        ledger.balance_after = wallet.balance;

        await ledger.save();

        return res.status(STATUS.SUCCESS.OK).send({ success: true,message: `Wallet credited successfully available balance ₹${wallet.balance.toFixed()}`});

    }catch(error) {

        console.log("Error in wallet payment",error);
    }
}

const fetchWalletInfo= async (req,res) => {
    
    const email= req.email;
    const user = await User.findOne({ email });

    const wallet= await Wallet.findOne({user_id:user._id});

    let transactionHistory= [];

    if(wallet) { 

        transactionHistory= await WalletLedger.find({wallet_id:wallet._id,status:{$ne:"pending"}}).sort({createdAt:-1}).limit(5);
    }

    let balance= wallet?.balance || 0;

    return res.status(STATUS.SUCCESS.OK).send({balance,transactionHistory,lastTransactionAt:wallet.lastTransactionAt});
}

export { createWalletOrder,verifyWalletPayment,fetchWalletInfo }