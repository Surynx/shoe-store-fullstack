import STATUS from "../../constants/status.constant.js";
import Banner from "../../models/banner.model.js";

const getDisplayBanner = async (req,res) => {
    
    const bannerDocs = await Banner.find({}).sort({position:1});

    return res.status(STATUS.SUCCESS.OK).json({bannerDocs});
}

export {getDisplayBanner}