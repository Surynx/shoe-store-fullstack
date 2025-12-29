import { findBestOffer } from "../computation/offer.computation.js";
import Coupon from "../models/coupon.model.js";
import Offer from "../models/offer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import Wallet from "../models/wallet.model.js";


const createOrderService = async (address_id, payment_method, coupon, user, cartItems, razorpay_payment_id = null) => {

    const cartItemsWithOffers = await Promise.all(cartItems.map(async (item) => {

        const product = await Product.findById(item.product_id);
        const variant = await Variant.findById(item.variant_id);

        const offers = await Offer.find({ $or: [{ category_id: product.category_id }, { product_id: product._id }], start_date: { $lte: new Date() }, end_date: { $gte: new Date() } })
        const bestOffer = findBestOffer(offers, variant.sales_price);

        return { ...item.toObject(), bestOffer: bestOffer }
    }));

    const orderItems = await Promise.all(cartItemsWithOffers.map(async (item) => {

        const variant = await Variant.findById(item.variant_id);

        const sales_price = (item.bestOffer) ? variant.sales_price - item.bestOffer.discount_price : variant.sales_price;

        return {
            product_id: item.product_id,
            variant_id: item.variant_id,
            sales_price,
            original_price: variant.original_price,
            quantity: item.quantity
        }
    }));

    const original_price_total = orderItems.reduce((acc, curr) => {
        acc += curr.original_price * curr.quantity;
        return acc;
    }, 0);

    const sales_price_total = orderItems.reduce((acc, curr) => {
        acc += curr.sales_price * curr.quantity;
        return acc;
    }, 0);

    const discount = original_price_total - sales_price_total;

    const delivery_charge = (payment_method == "cod") ? 7 : 0;

    let total_amount = original_price_total - discount;

    let discount_coupon = 0;

    if (coupon) {

        const couponDoc = await Coupon.findOne({ code: coupon.code });

        discount_coupon = couponDoc.type == "percentage" ? (sales_price_total * couponDoc.value) / 100 : couponDoc.value;

        discount_coupon = Math.min(discount_coupon, sales_price_total);
    }

    total_amount = total_amount - discount_coupon;

    const taxable_amount = sales_price_total - discount_coupon;

    const tax = Math.round(taxable_amount * 0.18);

    total_amount = total_amount + tax + delivery_charge;

    if (payment_method === "wallet") {

        const wallet = await Wallet.findOne({ user_id: user._id });

        if (!wallet || wallet.balance < total_amount) {

            return { success: false, error: "Insufficient wallet balance" };
        }
    }

    const newOrder = await Order.create({
        user_id: user._id,
        address_id,
        payment_method,
        payment_status: (payment_method != "wallet") ? "pending" : "paid",
        items: orderItems,
        discount,
        total_amount,
        tax,
        delivery_charge,
        payment_id: razorpay_payment_id
    });

    if (coupon) {

        newOrder.coupon_id = coupon._id;
        // newOrder.coupon_share = discount_coupon
        await newOrder.save();
    }

    return {success:true,newOrder};

}

export { createOrderService }