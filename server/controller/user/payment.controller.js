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

        let out_of_stock = false;

        for (let item of cartItems) {

            const variant = await Variant.findById(item.variant_id);

            if (variant.stock < item.quantity) {
                out_of_stock = true;
            }
        }

        if (out_of_stock) {

            return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false, message: "Cannot complete checkout since an item in your bag is currently out of stock" });
        }

        const { newOrder } = await createOrderService(address_id, payment_method, coupon, user, cartItems);

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

const verifyCheckoutPayment = async (req, res) => {

    try {

        const email = req.email;

        const user = await User.findOne({ email });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const orderDoc = await Order.findOne({ razorpay_order_id });

        if (!orderDoc) {

            return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Order not found" });
        }

        if (orderDoc.payment_status === "paid") {

            return res.status(STATUS.SUCCESS.OK).json({ success: true, message: "Payment already verified", orderId: orderDoc.orderId });
        }


        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

        if (signature !== razorpay_signature) {

            orderDoc.payment_status = "failed";

            await orderDoc.save();

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Payment verification failed" });
        }

        orderDoc.payment_status = "paid";
        orderDoc.payment_id = razorpay_payment_id;

        await orderDoc.save();

        const orderCount = await Order.countDocuments({ user_id: user._id, payment_status: "paid" });

        if (orderCount == 1 && user.referred_by) {

            let referrer = await User.findOne({ _id: user.referred_by });

            await Coupon.create({
                code: `REF-${referrer.referral_code}`,
                type: "flat",
                value: 200,
                min_purchase: 1000,
                usageLimit: 1,
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: true,
                createdFor: referrer._id
            });
        }

        if (req.body.source == "checkout") {

            await Cart.updateOne({ user_id: orderDoc.user_id }, { $set: { items: [] } });
        }

        const coupon_id = orderDoc.coupon_id;

        if (coupon_id) {

            await Coupon.updateOne({ _id: coupon_id }, { $inc: { usageCount: 1 } });
        }

        for (let item of orderDoc.items) {

            await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: -item.quantity } });
        }

        return res.status(STATUS.SUCCESS.CREATED).send({ success: true, orderId: orderDoc.orderId });

    } catch (error) {

        console.log("Error in checkout payment", error);
    }
}

const markPaymentFailed = async (req, res) => {

    try {

        const { razorpay_order_id } = req.body;

        const orderDoc = await Order.findOne({ razorpay_order_id });

        if (!orderDoc) {

            return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Order not found" });
        }

        orderDoc.payment_status = "failed";

        await orderDoc.save();

        return res.status(STATUS.SUCCESS.OK).json({ success: true, orderId: orderDoc.orderId, id: orderDoc._id, total: orderDoc.total_amount });

    } catch (error) {

        console.log("markPaymentFailed error", error);
    }
}

const createPaymentRetryOrder = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        const items = order.items;

        let out_of_stock = false;

        for (let item of items) {

            const variant = await Variant.findById(item.variant_id);

            if (variant.stock < item.quantity) {
                out_of_stock = true;
            }
        }

        if (out_of_stock) {

            return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false, message: "Payment retry is unavailable because one or more items in this order are out of stock. Please review your order." });
        }

        if (order.coupon_id) {

            const coupon = await Coupon.findOne({
                _id: order.coupon_id,
                min_purchase: { $lte: order.total_amount },
                start_date: { $lte: new Date() },
                end_date: { $gte: new Date() },
                status: true,
                $expr: { $lt: ["usageCount", "usageLimit"] },
                $or: [
                    { createdFor: order.user_id },
                    { createdFor: null }
                ]
            });

            if (!coupon) {

                return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "The coupon applied to this order is no longer valid. Please place a new order to continue." });
            }
        }


        if (order.payment_status == "paid") {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Payment is being Paid for the order" });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: order.total_amount * 100,
            currency: "INR",
            receipt: `Payment-${Date.now()}`,
            payment_capture: 1
        });

        order.razorpay_order_id = razorpayOrder.id
        await order.save();

        res.status(STATUS.SUCCESS.OK).send({ success: true, order: razorpayOrder });


    } catch (error) {

        console.log("Error in payment retry order!", error);
    }
}

export { createCheckoutOrder, verifyCheckoutPayment, markPaymentFailed, createPaymentRetryOrder }