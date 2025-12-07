import STATUS from "../../constants/status.constant.js";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";

const addBrand= async(req,res)=>{

    try{
    const {name,status} = req.body;
    const {path} = req.file;

    let doc= await Brand.findOne({name:{$regex:name,$options:"i"}});

    if(doc) {
        return res.status(STATUS.ERROR.CONFLICT).send({message:"Brand Already Exists!"});
    }

    await Brand.create({
        name,
        logo:path,
        status
    });

    return res.status(STATUS.SUCCESS.CREATED).send({message:"Brand Added Successfully!"});
    
    }catch(error) {
        console.log("Error in Adding Brand!",error);
    }

}

const fetchBrands= async(req,res)=>{
   try {

    const {search= '',page= 1} = req.query;
    const query= search ? {name:{$regex:search,$options:"i"}} : {};
    const limit=8;
    const skip= (Number(page)-1)*limit || 0;

    const total_doc= await Brand.countDocuments(query);
    const docs= await Brand.aggregate([{
        $match:query
    },{
        $skip:skip
    },{
        $limit:limit
    },{
        $lookup:{
            from:"products",
            localField:"_id",
            foreignField:"brand_id",
            as:"productList"
        }
    },{
        $addFields:{total_products:{$size:"$productList"}}
    },{
        $project:{productList:0}
    }]);

    return res.status(STATUS.SUCCESS.OK).send({docs,total_doc,limit});

   }catch(error) {
    console.log("Error in fetching Brands");
   }
}

const editBrand= async(req,res)=>{

    const {id}= req.params;
    const {name,status} = req.body;

    let doc= await Category.findOne({name:{$regex:name,$options:"i"}});

        if(doc) {
            return res.status(STATUS.ERROR.CONFLICT).send({success:false,message:"Brand already exists!"});
        }

    if(req.file) {

        const {path}= req.file;

        await Brand.updateOne({_id:id},{
            name,
            status,
            logo:path
        });

    }else {

        await Brand.updateOne({_id:id},{
        name,
        status
    });

    }
    
    //product list/unlist logic

    const updated_brand= await Brand.findOne({_id:id});
    const products= await Product.find({brand_id:id});

    for(let product of products) {

        const category= await Category.findOne({_id:product.category_id});

        const final_status = category.status && updated_brand.status;

        await Product.updateOne({_id:product.id},{$set:{status:final_status}});
    }

    return res.status(STATUS.SUCCESS.OK).send({message:"Brand Updated!"});
}

export {addBrand,fetchBrands,editBrand}