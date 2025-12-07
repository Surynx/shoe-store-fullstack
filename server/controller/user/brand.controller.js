import STATUS from "../../constants/status.constant.js";
import Brand from "../../models/brand.model.js";


const getAllBrandForUser= async(req,res)=> {

    try{

    const docs=await Brand.find({},{name:1,logo:1,status:1});

    return res.status(STATUS.SUCCESS.OK).send({data:docs});
    
    }catch(error) {
        console.log("Error in getAllBrandForUser")
    }

}

export { getAllBrandForUser }