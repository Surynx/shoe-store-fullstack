import STATUS from "../../constants/status.constant.js";
import Coupon from "../../models/coupon.model.js";

const addNewCoupon= async (req,res) => {
    
    try{

    const { code,type,value,endDate, min_purchase=0 ,startDate,status,usageLimit }= req.body;

    if (type === "percentage" && value >= 60) {

      return res.status(STATUS.ERROR.CONFLICT).send({success: false,message: "Percentage value cannot exceed 60%",});
    }

    if (type === "flat" && value > min_purchase * 0.5) {

        return res.status(STATUS.ERROR.CONFLICT).send({ success: false, message: "Flat coupon value cannot exceed 50% of minimum purchase amount" });
    }

    if (new Date(startDate) >= new Date(endDate)) {

        return res.status(STATUS.ERROR.CONFLICT).send({ success: false,message: "End date must be after start date" });
    }

    const coupon_exist= await Coupon.findOne({code:code.toUpperCase()});

    if (coupon_exist) {
        
        return res.status(STATUS.ERROR.CONFLICT).send({ success: false,message: "Coupon code already exists" });
    }

    await Coupon.create({
        code:code.toUpperCase(),
        type,
        value,
        end_date:endDate,
        start_date:startDate,
        min_purchase,
        usageLimit,
        status
    });

    return res.status(STATUS.SUCCESS.CREATED).send({ success: true,message: "Coupon created successfully" });

    }catch(error) {

        console.log("Error in AddNewCoupon",error);
    }
}

const getAllCoupon= async (req,res) => {
    
    try {

        const { search, page } = req.query;
        const query = search ? { code: { $regex: search, $options: "i" } } : {};
        const limit = 5;
        const skip = (Number(page) - 1) * limit || 0;

        const total_doc = await Coupon.countDocuments(query);

        const docs = await Coupon.aggregate([{
            $sort:{createdAt:-1}
        },{
            $match: query
        }, {
            $skip: skip
        }, {
            $limit: limit
        }]);

        return res.status(STATUS.SUCCESS.OK).send({docs,total_doc,limit});

    } catch (error) {

        console.log("Error in Fetching coupon info",error);

    }
}

const changeCouponStatus= async (req,res) => {
    
    const {id}= req.params;

    const { code,type,value,endDate, min_purchase=0 ,startDate,status,usageLimit } = req.body;

    if (type == "percentage" && value >= 60) {

      return res.status(STATUS.ERROR.CONFLICT).send({success: false,message: "Percentage value cannot exceed 60%",});
    }

    if (type == "flat" && value > min_purchase * 0.5) {

        return res.status(STATUS.ERROR.CONFLICT).send({ success: false, message: "Flat coupon value cannot exceed 50% of minimum purchase amount" });
    }

    if (new Date(startDate) >= new Date(endDate)) {

        return res.status(STATUS.ERROR.CONFLICT).send({ success: false,message: "End date must be after start date" });
    }

    const couponCodeExist = await Coupon.findOne({code:code.toUpperCase(),_id:{$ne:id}});

    if (couponCodeExist) {

      return res.status(STATUS.ERROR.BAD_REQUEST).json({ success: false,message: "Coupon Code Already Exists!" });
    }

    const coupon= await Coupon.findById(id);

    coupon.updateOne({
        code,

    })

    await coupon.updateOne({
        code:code.toUpperCase(),
        type,
        value,
        end_date:endDate,
        start_date:startDate,
        min_purchase,
        usageLimit,
        status
    });

    await coupon.save();

    return res.status(STATUS.SUCCESS.OK).send({success:true , message:"Coupon Updated successfully"});
}

export { addNewCoupon,getAllCoupon,changeCouponStatus }