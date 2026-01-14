import Banner from "../../models/banner.model.js";
import STATUS from "../../constants/status.constant.js";

const addBanner = async (req,res) => {

    try{
    
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

    }catch(error) {

        console.log("Error in add banner",error);
    }
}

const fetchBannerList = async (req,res) => {
    
    try{
    const bannerDocs = await Banner.find({}).sort({position:1});

    return res.status(STATUS.SUCCESS.OK).json({bannerDocs});

    }catch(error) {

        console.log("Error in fetch brand list",error);
    }
}

const removeBanner = async (req, res) => {

  try{

  const { id } = req.params;

  await Banner.findByIdAndDelete(id);

  return res.status(STATUS.SUCCESS.OK).json({ success:true });

  }catch(error) {

    console.log("Error in remove banner",error);
  }
};


const changeBannerPosition = async (req,res) => {

    try {
        
        const {id} = req.params;

        const {position} = req.body;

        const BannerToEditPosition = await Banner.findById(id);

        const bannerInThePosition = await Banner.findOne({position,_id: { $ne: id }});

        if(bannerInThePosition) {

            bannerInThePosition.position = BannerToEditPosition.position;
            await bannerInThePosition.save();
        }

        BannerToEditPosition.position = position;
        await BannerToEditPosition.save();

        return res.status(STATUS.SUCCESS.OK).json({message:`Banner position Updated to ${position}`})

    } catch (error) {
        
        console.log("Error in banner update",error);
    }
}


export { addBanner,fetchBannerList,removeBanner,changeBannerPosition }