import STATUS from "../../constants/status.constant.js";
import Category from "../../models/category.model.js";


const getAllCategoryForUser= async(req,res)=> {

    try{
        
    const docs=await Category.find({},{name:1,status:1});

    return res.status(STATUS.SUCCESS.OK).send({data:docs});

    }catch(error) {
        console.log("Error in getAllCategoryForUser")
    }

}

export { getAllCategoryForUser }