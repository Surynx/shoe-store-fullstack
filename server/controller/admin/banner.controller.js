import Banner from "../../models/banner.model.js";
import STATUS from "../../constants/status.constant.js";

const addBanner = async (req,res) => {
    
    const {path} = req.file;

    const { position,title,sub_title } = req.body;
    
    const position_exist = await Banner.findOne({position});

    if( position_exist ) {

        return res.status(STATUS.ERROR.BAD_REQUEST).json({message:"Position Already Choosen!"});
    }

    await Banner.create({
        position,
        image:path,
        title,
        sub_title
    });

    return res.status(STATUS.SUCCESS.CREATED).json({message:"New banner Uploaded!"});
}

const fetchBannerList = async (req,res) => {
    
    const bannerDocs = await Banner.find({}).sort({position:1});

    return res.status(STATUS.SUCCESS.OK).json({bannerDocs});
}

const removeBanner = async (req, res) => {

  const { id } = req.params;

  await Banner.findByIdAndDelete(id);

  return res.status(STATUS.SUCCESS.OK).json({ success:true });
};


export { addBanner,fetchBannerList,removeBanner }