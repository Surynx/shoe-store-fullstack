import { findBestOffer } from "../../computation/offer.computation.js";
import STATUS from "../../constants/status.constant.js";
import Cart from "../../models/cart.model.js";
import Coupon from "../../models/coupon.model.js";
import Offer from "../../models/offer.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import Variant from "../../models/variant.model.js";
import PDFDocument from "pdfkit";


const placeNewOrder = async (req, res) => {

    const email = req.email;
    const user = await User.findOne({ email });

    const { selectedAddress: address_id, selectedPayment: payment_method, appliedCoupon: coupon } = req.body;

    if (!address_id || !payment_method) {

        return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Address and payment method required!" });
    }

    const cart = await Cart.findOne({ user_id: user._id });

    const cartItems = cart?.items;

    if (!cart || cartItems === 0) {

        return res.status(400).json({ success: false, message: "Cart is empty!" });
    }

    const cartItemsWithOffers= await Promise.all(cartItems.map( async(item)=> {

        const product= await Product.findById(item.product_id);
        const variant= await Variant.findById(item.variant_id);

        const offers= await Offer.find({$or:[{category_id:product.category_id},{product_id:product._id}], start_date:{ $lte:new Date() },end_date:{ $gte:new Date()}})
        const bestOffer = findBestOffer(offers,variant.sales_price);

        return {...item.toObject(),bestOffer:bestOffer}
    }));

    const orderItems= await Promise.all(cartItemsWithOffers.map( async(item)=>{

        const variant= await Variant.findById(item.variant_id);

        const sales_price= (item.bestOffer) ? variant.sales_price - item.bestOffer.discount_price : variant.sales_price;

        return{
            product_id:item.product_id,
            variant_id:item.variant_id,
            sales_price,
            original_price:variant.original_price,
            quantity:item.quantity
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

    const tax = Math.round(sales_price_total * 0.18);

    let total_amount = original_price_total - discount + delivery_charge + tax;

    let discount_coupon= 0;

    if(coupon) {

        const couponDoc= await Coupon.findOne({code:coupon.code});
        discount_coupon= couponDoc.type == "percentage" ? (total_amount*couponDoc.value)/100 : couponDoc.value;

        couponDoc.usageLimit -=1;
        couponDoc.usageCount +=1;

        couponDoc.save();
    }

    total_amount= total_amount - discount_coupon;

    const newOrder = await Order.create({
        user_id: user._id,
        address_id,
        payment_method,
        payment_status: (payment_method == "cod") ? "pending" : "paid",
        items: orderItems,
        discount,
        total_amount,
        tax,
        delivery_charge,
    });

    if(coupon) {

        newOrder.coupon_id= coupon._id;
        newOrder.save();
    }

    for (let item of cartItems) {

        await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: -item.quantity } });
    }

    await Cart.updateOne({ user_id: user._id }, { $set: { items: [] } });

    return res.status(STATUS.SUCCESS.CREATED).send({ success: true, orderId: newOrder.orderId });

}

const getOrderDetails = async (req, res) => {

    const { id } = req.params;

    const orderDoc = await Order.findOne({ _id: id }).populate("items.product_id").populate("items.variant_id").populate("address_id");

    if (!orderDoc) {

        return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    return res.status(STATUS.SUCCESS.OK).json({ success: true, orderDoc: orderDoc });

}

const fetchAllOrders = async (req, res) => {

    try {

        const email = req.email;
        const user = await User.findOne({ email });

        const orderDocs = await Order.find({ user_id: user._id }).populate("items.product_id").populate("items.variant_id").sort({ createdAt: -1 });

        return res.status(STATUS.SUCCESS.OK).send({ orderDocs });

    } catch (error) {
        console.log("Error in fetchAllOrders", error);

    }

}

const handleCancelOrder = async (req, res) => {

    try {
        const email = req.email;
        const { id } = req.params;

        const orderDoc = await Order.findById(id).populate("items.product_id").populate("items.variant_id");

        if (orderDoc.status == "canceled") {

            return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Order already canceled" });
        }

        if (orderDoc.status == "shipped" || orderDoc.status == "out_for_delivery" || orderDoc.status == "delivered") {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: `The Order ${orderDoc.orderId} cannot cancel since it is being ${orderDoc.status}` });
        }

        for (let item of orderDoc.items) {

            if (item.status != "canceled") {

                await Order.updateOne({ _id: id, "items._id": item.id }, { $set: { "items.$.status": "canceled", "items.$.cancelledAt": new Date() } });
                await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: item.quantity } });
            }
        }

        await Order.updateOne({ _id: id }, { $set: { status: "canceled", cancelledAt: new Date() } });

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: `Order ${orderDoc.orderId} has canceled successfully!` });

    } catch (error) {

        console.log("Error in handleCancelOrder", error);
    }

}

const handleCancelItem = async (req, res) => {

    const { order_id, item_id } = req.params;

    const orderDoc = await Order.findById(order_id);

    if (orderDoc.status == "canceled") {

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Order already canceled" });
    }

    if (orderDoc.status == "shipped" || orderDoc.status == "out_for_delivery" || orderDoc.status == "delivered") {

        return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: `The Order ${orderDoc.orderId} cannot cancel since it is being ${orderDoc.status}` });
    }

    for (let item of orderDoc.items) {

        if (item._id == item_id && item.status == "canceled") {
            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: `The item is Canceled Already!` });
        }

        if (item._id == item_id) {

            await Order.updateOne({ _id: order_id, "items._id": item_id }, { $set: { "items.$.status": "canceled", "items.$.cancelledAt": new Date() } });
            await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: item.quantity } });
            await orderDoc.save();

            break;
        }
    }

    const newOrderDoc = await Order.findById(order_id);

    let all_item_canceled = true;

    for (let item of newOrderDoc.items) {

        if (item.status != "canceled") {
            all_item_canceled = false;
        }
    }

    if (all_item_canceled) {
        await Order.updateOne({ _id: order_id }, { $set: { status: "canceled" } });
    }

    return res.status(STATUS.SUCCESS.OK).send({ success: true, message: `Product is being canceled from order ${orderDoc.orderId}` });
}

const handleReturnProduct = async (req, res) => {

    try {
        const { order_id, item_id } = req.params;
        const { returnReason } = req.body;

        const orderDoc = await Order.findById(order_id);

        const item = orderDoc.items.id(item_id);

        if (item.status !== "delivered") {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Item is not eligible for return as it is not delivered", });
        }

        if (item.return_status === "Requested") {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Return already requested for this item" });
        }

        item.return_status = "Requested";
        item.return_reason = returnReason;
        item.return_date = new Date();

        await orderDoc.save();

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Return request submitted successfully" });

    } catch (error) {

        console.log("Error in return product", error);
    }

}

const generateInvoice = async (req, res) => {

    try {

        const { order_id } = req.params;

        const order = await Order.findById(order_id).populate("items.product_id").populate("items.variant_id").populate("user_id").populate("address_id");

        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text("INVOICE", { align: "center" });
        doc.moveDown();


        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Status: ${order.status}`);
        doc.moveDown();


        doc.fontSize(14).text("Customer Details:");
        doc.fontSize(12).text(order.user_id.name);
        doc.text(order.user_id.email);
        doc.moveDown();


        doc.fontSize(14).text("Shipping Address:");
        doc.fontSize(12)
            .text(order.address_id.address_line1)
            .text(order.address_id.city)
            .text(order.address_id.state)
            .text(order.address_id.pincode);
        doc.moveDown();

        doc.fontSize(14).text("Items:");
        doc.moveDown(0.5);

        order.items.forEach((it, index) => {
            doc.fontSize(12).text(
                `${index + 1}. ${it.product_id.name} (${it.variant_id.color || ""} ${it.variant_id.size || ""
                })`
            );
            doc.text(`Qty: ${it.quantity}  Price: ₹${it.price}`);
            doc.text(`Subtotal: ₹${it.quantity * it.price}`);
            doc.moveDown();
        });

        doc.moveDown();
        doc.fontSize(14).text("Total Summary:");
        doc.fontSize(12).text(`Subtotal: ₹${order.subtotal}`);
        doc.text(`Shipping: ₹${order.shipping_charge}`);
        doc.text(`Grand Total: ₹${order.total}`);

        doc.end();

    } catch (error) {

        console.log("Error in generating Invoice for order!", error);
    }
}



export { placeNewOrder, getOrderDetails, fetchAllOrders, handleCancelOrder, handleCancelItem, handleReturnProduct, generateInvoice }