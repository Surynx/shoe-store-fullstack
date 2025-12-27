import razorpay from "../../config/razorpay.config.js";
import STATUS from "../../constants/status.constant.js";
import Cart from "../../models/cart.model.js";
import User from "../../models/user.model.js";
import crypto from "crypto";
import { createOrderService } from "../../services/order.service.js";
import Order from "../../models/order.model.js";
import Coupon from "../../models/coupon.model.js";
import Variant from "../../models/variant.model.js";

const createCheckoutOrder = async (req, res) => {

    try {

        const { selectedAddress: address_id, selectedPayment: payment_method, appliedCoupon: coupon } = req.body;

        if (!address_id || !payment_method) {

        return res.status(STATUS.ERROR.NOT_FOUND).send({ success: false, message: "Address and payment method required!" });
        }

        const email = req.email;

        const user = await User.findOne({ email });

        const cart = await Cart.findOne({ user_id: user._id });

        const cartItems = cart.items;

        const newOrder = await createOrderService(address_id,payment_method,coupon,user,cartItems);

        const order = await razorpay.orders.create({
            amount: newOrder.total_amount * 100,
            currency: "INR",
            receipt: `Payment-${Date.now()}`,
            payment_capture: 1
        });

        newOrder.razorpay_order_id = order.id
        await newOrder.save();

        res.status(STATUS.SUCCESS.OK).send({ success: true, order })

    } catch (error) {

        console.log("Erron in create order for checkout", error);
    }
}

const verifyCheckoutPayment= async(req,res)=> {

    try{

        const { razorpay_order_id,razorpay_payment_id,razorpay_signature } = req.body;

        const orderDoc = await Order.findOne({razorpay_order_id});

        if(!orderDoc) {

            return res.status(STATUS.ERROR.NOT_FOUND).json({success: false,message: "Order not found"});
        }
        
        const body= `${razorpay_order_id}|${razorpay_payment_id}`;

        const signature= crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if( signature !== razorpay_signature ) {

            orderDoc.payment_status = "failed";

            await orderDoc.save();

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Payment verification failed" });
        }

        orderDoc.payment_status = "paid";
        orderDoc.payment_id = razorpay_payment_id;

        await orderDoc.save();

        const coupon_id = orderDoc.coupon_id;

        if (coupon_id) {

            await Coupon.updateOne({ _id:coupon_id },{ $inc: { usageCount: 1 }} );
        }

        for (let item of orderDoc.items) {

            await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: -item.quantity } });
        }

        await Cart.updateOne({ user_id: orderDoc.user_id }, { $set: { items: [] } });

        return res.status(STATUS.SUCCESS.CREATED).send({ success: true, orderId: orderDoc.orderId });    

    }catch(error) {

        console.log("Error in checkout payment",error);
    }
}

const markPaymentFailed = async (req,res) => {

    try{

    const {razorpay_order_id} = req.body;

    const orderDoc = await Order.findOne({razorpay_order_id});

    if(!orderDoc) {

        return res.status(STATUS.ERROR.NOT_FOUND).json({success: false,message: "Order not found"});
    }

    orderDoc.payment_status = "failed";

    await orderDoc.save();

    return res.status(STATUS.SUCCESS.OK).json({ success: true,orderId: orderDoc.orderId });

    }catch(error) {

        console.log("markPaymentFailed error", error);
    }
}

export { createCheckoutOrder,verifyCheckoutPayment,markPaymentFailed }