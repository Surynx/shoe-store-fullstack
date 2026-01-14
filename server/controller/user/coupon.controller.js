import STATUS from "../../constants/status.constant.js";
import Coupon from "../../models/coupon.model.js";

const validateCoupon= async (req,res) => {
    
    const {code}= req.body;

    const coupon = await Coupon.find({code});

    if(coupon.length <= 0) {

        return res.status(STATUS.ERROR.BAD_REQUEST).send({message:"Invalid Coupon Code!"});
    }

    return res.status(STATUS.SUCCESS.OK).send({ success:true,message:`${coupon[0].code} Applied to your purchase amount!`,coupon });
}

export {validateCoupon}