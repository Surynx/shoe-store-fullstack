import STATUS from "../../constants/status.constant.js";
import Banner from "../../models/banner.model.js";
import Brand from "../../models/brand.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";

const getHomeInfo = async (req,res) => {
    
    const bannerDocs = await Banner.find({}).sort({position:1});

    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const brandCount = await Brand.countDocuments();

    return res.status(STATUS.SUCCESS.OK).json({ bannerDocs,userCount,productCount,brandCount });
}

export {getHomeInfo}