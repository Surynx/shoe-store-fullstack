import STATUS from "../constants/status.constant.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Variant from "../models/variant.model.js";


const placeNewOrder= async(req,res)=> {

    const email= req.email;
    const user= await User.findOne({email});

    const {selectedAddress : address_id , selectedPayment : payment_method}= req.body;

    if (!address_id || !payment_method) {

      return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Address and payment method required!" });
    }

    const cart= await Cart.findOne({user_id:user._id});

    const cartItems= cart?.items;

    if (!cart || cartItems === 0) {

      return res.status(400).json({ success: false, message: "Cart is empty!" });
    }

    const original_price_total = cartItems.reduce((acc, curr) => {
    acc += curr.original_price * curr.quantity;
    return acc;
    }, 0);

    const sales_price_total = cartItems.reduce((acc, curr) => {
    acc += curr.sales_price * curr.quantity;
    return acc;
    }, 0);

    const discount= original_price_total-sales_price_total;

    const delivery_charge= (payment_method == "cod") ? 7 : 0;

    const tax= Math.round(sales_price_total * 0.18);

    const total_amount= sales_price_total + delivery_charge + tax;

    const newOrder= await Order.create({
        user_id:user._id,
        address_id,
        payment_method,
        payment_status: (payment_method == "cod") ? "pending" : "paid",
        items:cartItems,
        discount,
        total_amount,
        tax,
        delivery_charge
    });
    console.log(cartItems);
    
    for(let item of cartItems) {

        await Variant.updateOne({_id:item.variant_id},{$inc:{stock:-item.quantity}});
    }

    await Cart.updateOne({user_id:user._id},{$set:{items:[]}});

    return res.status(STATUS.SUCCESS.CREATED).send({success:true,orderId:newOrder.orderId});
   
}

const getOrderDetails= async (req,res) => {
    
    const {id}= req.params;
    
    const orderDoc= await Order.findOne({_id:id}).populate("items.product_id").populate("items.variant_id").populate("address_id");

     if (!orderDoc) {

      return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Order not found!" });
    }
    
    return res.status(STATUS.SUCCESS.OK).json({ success: true, orderDoc:orderDoc });
    
}

const fetchAllOrders= async(req,res)=> {

    try{

    const email= req.email;
    const user= await User.findOne({email});

    const orderDocs= await Order.find({user_id:user._id}).populate("items.product_id").populate("items.variant_id");

    return res.status(STATUS.SUCCESS.OK).send({orderDocs});

    }catch(error) {
        console.log("Error in fetchAllOrders",error);

    }

}

const handleCancelOrder= async(req,res)=> {

    try{
    const email= req.email;
    const {id}= req.params;

    const orderDoc= await Order.findById(id).populate("items.product_id").populate("items.variant_id");

    if(orderDoc.status == "canceled") {

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Order already canceled" });
    }

    if(orderDoc.status == "shipped" || orderDoc.status == "out_for_delivery" || orderDoc.status == "delivered") {

        return res.status(STATUS.ERROR.BAD_REQUEST).send({ success:false, message: `The Order ${orderDoc.orderId} cannot cancel since it is being ${orderDoc.status}`});
    }

    for(let item of orderDoc.items) {

        if(item.status != "canceled") {

            await Order.updateOne({_id:id,"items._id":item.id},{$set:{"items.$.status":"canceled"}});
            await Variant.updateOne({_id:item.variant_id},{$inc:{stock:item.quantity}});
        }
    }

    await Order.updateOne({_id:id},{$set:{status:"canceled",cancelledAt:new Date()}});

    return res.status(STATUS.SUCCESS.OK).send({ success:true,message:`Order ${orderDoc.orderId} has canceled successfully!` });

    }catch(error) {

        console.log("Error in handleCancelOrder",error);
    }
    
}

const handleCancelItem= async(req,res)=> {

    const { order_id,item_id }= req.params;

    const orderDoc= await Order.findById(order_id);

    if(orderDoc.status == "canceled") {

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Order already canceled" });
    }

    if(orderDoc.status == "shipped" || orderDoc.status == "out_for_delivery" || orderDoc.status == "delivered") {

        return res.status(STATUS.ERROR.BAD_REQUEST).send({ success:false, message: `The Order ${orderDoc.orderId} cannot cancel since it is being ${orderDoc.status}`});
    }

    for(let item of orderDoc.items) {

        if(item._id == item_id && item.status == "canceled") {
            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success:false, message: `The item is Canceled Already!`});
        }

        if(item._id == item_id) {

            await Order.updateOne({_id:order_id,"items._id": item_id},{$set:{"items.$.status":"canceled","items.$.cancelledAt":new Date()}});
            await Variant.updateOne({_id:item.variant_id},{$inc:{stock:item.quantity}});
            await orderDoc.save();

            break;
        }
    }

    for(let item of orderDoc.items) {

        if( item.status != "canceled") {
            break
        }

        await Order.updateOne({_id:order_id},{$set:{status:"canceled"}});
    }

    return res.status(STATUS.SUCCESS.OK).send({success:true,message:`Product is being canceled from order ${orderDoc.orderId}`});
}

export { placeNewOrder,getOrderDetails,fetchAllOrders,handleCancelOrder,handleCancelItem }