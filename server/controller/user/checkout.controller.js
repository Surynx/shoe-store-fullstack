import STATUS from "../../constants/status.constant.js";
import Address from "../../models/address.model.js";
import Cart from "../../models/cart.model.js";
import User from "../../models/user.model.js";
import { cleanCartDoc } from "../../utils/cart.util.js";


const getCheckoutData= async(req,res)=> {

    try{
    const email= req.email;

    const user= await User.findOne({email});

    if (!user) {
      return res.status(STATUS.ERROR.NOT_FOUND).json({ success:false,message: "User not found" });
    }

    const addressDocs= await Address.find({user_id:user._id});

    const cartDoc= await Cart.findOne({user_id:user._id}).populate("items.product_id").populate("items.variant_id");

    const cartItems= cleanCartDoc(cartDoc);

    res.status(STATUS.SUCCESS.OK).send({cartItems,addressDocs});

    }catch(error) {

        console.log("Error in getcheckoutData",error);
    }
}

export {getCheckoutData}