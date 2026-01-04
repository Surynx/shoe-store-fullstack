import Admin from "../../models/admin.model.js"
import STATUS from "../../constants/status.constant.js";
import Order from "../../models/order.model.js";
import User from "../../models/user.model.js";
import Product from "../../models/product.model.js";
import { getTopBrand, getTopProducts, getTotal_revenue } from "../../computation/dashboard.computation.js";
import { findReturnRequest } from "../../utils/dashboard.util.js";

const getDashboardInfo = async (req,res) => {
    
    const admin = await Admin.findOne({});

    const totalSuccessfullOrders = await Order.find({ status:"delivered",payment_status:"paid" }).populate("user_id");

    const  total_revenue = await getTotal_revenue(totalSuccessfullOrders);

    const total_orders = await Order.countDocuments({payment_status:{$ne:"failed"}});

    const active_users = await User.countDocuments({isVerified:true});

    const listed_products = await Product.countDocuments({status:true});

    const stats = {total_revenue,total_orders,active_users,listed_products}

    const top_products = await getTopProducts(totalSuccessfullOrders);

    const top_brands = await getTopBrand(totalSuccessfullOrders);

    const return_request = await findReturnRequest(totalSuccessfullOrders);

    const recent_orders = await Order.find().populate("user_id").limit(5);

    res.status(STATUS.SUCCESS.OK).json({ adminEmail:admin.email,stats,top_products,top_brands,top_brands,return_request,recent_orders });
}

export { getDashboardInfo }