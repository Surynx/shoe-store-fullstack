import STATUS from "../../constants/status.constant.js";
import Order from "../../models/order.model.js"
import Variant from "../../models/variant.model.js";

const fetchOrdersInfo = async (req, res) => {

    try {

        const { search, page } = req.query;
        const query = search ? { orderId: { $regex: search, $options: "i" } } : {};
        const limit = 10;
        const skip = (Number(page) - 1) * limit || 0;

        const total_doc = await Order.countDocuments(query);

        const docs = await Order.aggregate([{
            $match: query
        }, {
            $skip: skip
        }, {
            $limit: limit
        }, {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user"
            }
        },{
            $sort:{order_date:-1}
        }]);

        return res.status(STATUS.SUCCESS.OK).send({docs,total_doc,limit});

    } catch (error) {

        console.log("Error in Fetching order info",error);

    }
}

const getDetailsOfOrder= async (req,res) => {
    
    const {id}= req.params;

    const orderDoc= await Order.findOne({_id:id}).populate("items.product_id").populate("items.variant_id").populate("address_id").populate("user_id");

    if (!orderDoc) {

      return res.status(STATUS.ERROR.NOT_FOUND).json({ success: false, message: "Order not found!" });
    }

    return res.status(STATUS.SUCCESS.OK).json({ success: true, orderDoc:orderDoc });
    
}

const changeOrderStatus= async(req,res)=> {

    const {status}= req.body;
    const {id}= req.params;
    
    const orderDoc= await Order.findById(id);

    if(orderDoc.status == "canceled" || orderDoc.status == "delivered") {

        return res.status(STATUS.ERROR.BAD_REQUEST).send({ success:false,message:`Order is already ${orderDoc.status}. Cannot update.` });
    }

    orderDoc.status = status

    orderDoc.items = orderDoc.items.map(item => {
      if(item.status !== "canceled") {
          item.status = status;
      }
      return item;
    });

       await orderDoc.save();

     return res.status(STATUS.SUCCESS.OK).send({ success: true,message: `Order ${orderDoc.status} successfully` });
}

const approveReturn= async (req,res) => {
    
    try{

        const { order_id, item_id } = req.params;

        const orderDoc = await Order.findById(order_id);

        const item= orderDoc.items.id(item_id);

        if (item.status === "canceled") {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Canceled items cannot be returned." });
        }

        if (item.return_status !== "Requested") {

            return res.status(STATUS.ERROR.BAD_REQUEST).json({success: false,message: "Return request is not pending approval."});
        }

        item.return_status = "Approved";
        item.return_approved_date = new Date(); 

        await orderDoc.save();

        return res.status(STATUS.SUCCESS.OK).json({success: true,message: "Return request approved successfully." });

    }catch(error) {

        console.log("Error in approve Return Req");
    }
}

const completeReturn= async (req,res) => {
    
    const {order_id,item_id}= req.params;

    const orderDoc = await Order.findById(order_id);

    const item= orderDoc.items.id(item_id);

    if(item.return_status == "Completed") {
        res.status(STATUS.ERROR.BAD_REQUEST).send({success: true,message: "Return is already completed"});
    }

    item.return_status = "Completed";
    item.return_approved_date = new Date(); 

    await Variant.findByIdAndUpdate(item.variant_id, { $inc: { stock: item.quantity }});

    await orderDoc.save();

    return res.status(STATUS.SUCCESS.OK).json({success: true,message: "Return request completed successfully." });
}

const rejectReturn= async(req,res)=> {

    try{
    const {order_id,item_id}= req.params;

    const orderDoc= await Order.findById(order_id);

    const item= orderDoc.items.id(item_id);

    item.return_status = "Rejected";

    await orderDoc.save();

    return res.status(STATUS.SUCCESS.OK).json({success: true,message: "Return request completed successfully."});

    }catch(error) {

        console.log("Error in rejectReturn");
    }
}

export { fetchOrdersInfo,getDetailsOfOrder,changeOrderStatus,approveReturn,completeReturn,rejectReturn }