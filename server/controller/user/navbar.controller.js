import STATUS from "../../constants/status.constant.js";
import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";

const navbarInfo = async (req, res) => {

    const email = req.email;

    const user = await User.findOne({ email });

    const cartDoc = await Cart.findOne({ user_id: user._id });

    return res.status(STATUS.SUCCESS.OK).send({ count: cartDoc?.items?.length, username: user.name });
}

const searchProducts = async (req,res) => {
    
    const {search} = req.query;

    const productDoc = await Product.find({name:{$regex:search,$options:"i"}}).populate("category_id");

    return res.status(STATUS.SUCCESS.OK).json({productDoc});
}

export {navbarInfo,searchProducts}