import STATUS from "../../constants/status.constant.js";
import Coupon from "../../models/coupon.model.js";
import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import Variant from "../../models/variant.model.js";
import PDFDocument from "pdfkit";
import Wallet from "../../models/wallet.model.js";
import WalletLedger from "../../models/wallet-ledger.model.js";
import { createOrderService } from "../../services/order.service.js";
import { findRefundAmount } from "../../computation/refund.computation.js";
import Cart from "../../models/cart.model.js";


const placeNewOrder = async (req, res) => {

    const email = req.email;

    const user = await User.findOne({ email });

    const cart = await Cart.findOne({ user_id: user._id });

    const cartItems = cart?.items;

    if (!cart || cartItems.length === 0) {

        return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false, message: "Cart is empty!" });
    }

    let out_of_stock = false;

    for(let item of cartItems) {

        const variant = await Variant.findById(item.variant_id);

        if(variant.stock < item.quantity) {
            out_of_stock = true;
        }
    }

    if(out_of_stock) {

        return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false, message: "Cannot complete checkout since an item in your bag is currently out of stock" });
    }

    const { selectedAddress: address_id, selectedPayment: payment_method, appliedCoupon: coupon } = req.body;

    if (!address_id || !payment_method) {

        return res.status(STATUS.ERROR.NOT_FOUND).send({ success: false, message: "Address and payment method required!" });
    }

    let wallet;

    if (payment_method == "wallet") {

        wallet = await Wallet.findOne({ user_id: user._id });

        if (!wallet) {
            return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false, message: "Wallet not found. Please add money to your wallet to continue" });
        }

    }

    const result = await createOrderService(address_id,payment_method,coupon,user,cartItems);

    if(!result.success && result.error) {

         return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false,message: result.error });
    }

    if (payment_method == "wallet") {

        wallet.balance -= result.newOrder.total_amount;
        wallet.lastTransactionAt = new Date();

        await wallet.save();

        await WalletLedger.create({
            wallet_id: wallet._id,
            orderId: result.newOrder.orderId,
            amount: result.newOrder.total_amount,
            transaction_type: "debited",
            reason: "Purchase",
            status: "completed",
            balance_after: wallet.balance
        });

    }

    if (coupon) {

        await Coupon.updateOne({ code: coupon.code },{ $inc: { usageCount: 1 },$push: {applied_by: user._id} } );
    }

    for (let item of result.newOrder.items) {

        await Variant.updateOne({ _id: item.variant_id }, { $inc: { stock: -item.quantity } });
    }

    await Cart.updateOne({ user_id: result.newOrder.user_id }, { $set: { items: [] } });

    return res.status(STATUS.SUCCESS.CREATED).send({ success: true, orderId: result.newOrder.orderId });

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

        const { search = '',page = 1} = req.query;

        const query= search ? { user_id:user._id, orderId:{$regex:search,$options:"i"} } : {user_id:user._id};

        const limit=4;

        const skip= (Number(page)-1)*limit || 0;

        const total_doc= await Order.countDocuments(query);

        const orderDocs = await Order.find(query).populate("items.product_id").populate("items.variant_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        return res.status(STATUS.SUCCESS.OK).send({ orderDocs,total_doc,limit });

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

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: true, message: "Order already canceled" });
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

        if (orderDoc.payment_status == "paid") {

            if (orderDoc.payment_method != "cod") {

                const refundAmount = orderDoc.total_amount;

                const user = await User.findOne({ email });

                let wallet = await Wallet.findOne({ user_id: user._id });

                if (!wallet) {
                    await Wallet.create({
                        user_id: user._id,
                        balance: refundAmount,
                        lastTransactionAt: new Date()
                    });
                } else {

                    wallet.balance += refundAmount;
                    wallet.lastTransactionAt = new Date();

                    await wallet.save();
                }

                await WalletLedger.create({
                    wallet_id: wallet._id,
                    amount: refundAmount, 
                    balance_after: wallet.balance,
                    transaction_type: "credited",
                    orderId: orderDoc.orderId,
                    reason: "Cancel Refund",
                    status: "completed"
                });

            }

            await Order.updateOne({ _id: id }, { $set: { payment_status: "refunded" } });

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

        return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: true, message: "Order already canceled" });
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

        if( orderDoc.payment_status == "paid" && orderDoc.payment_method != "cod"){

            await Order.updateOne({_id:order_id},{ $set:{payment_status:"refunded"} });
        }
    }

    if (orderDoc.payment_status == "paid" && orderDoc.payment_method != "cod") {

        const item = await orderDoc.items.id(item_id);

        let coupon = null;

        if (orderDoc?.coupon_id) {

            coupon = await Coupon.findById(orderDoc.coupon_id);
        }

        const refundAmount = findRefundAmount(orderDoc,item,coupon)

        let email= req.email;

        let user= await User.findOne({email});

        let wallet = await Wallet.findOne({ user_id: user._id });

        if (!wallet) {

            Wallet.create({
                user_id: user._id,
                balance: refundAmount,
                lastTransactionAt: new Date()
            });
        } else {

            wallet.balance += refundAmount;
            wallet.lastTransactionAt = new Date();

            await wallet.save();
        }

        await WalletLedger.create({
            wallet_id: wallet._id,
            amount: refundAmount,
            balance_after: wallet.balance,
            transaction_type: "credited",
            orderId: orderDoc.orderId,
            reason: "Cancel Refund",
            status: "completed"
        });
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