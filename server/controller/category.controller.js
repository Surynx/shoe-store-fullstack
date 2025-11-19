import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

const addcategory= async(req,res)=> {

    try{
    const { name,description,status } = req.body;
    let doc = await Category.findOne({name:{$regex:name,$options:"i"}});

    if(!doc) {
        await Category.create({
        name,
        description,
        status
    });
       
        return res.status(200).send({success:true,message:"New Category Added!"});
    }

    return res.status(409).send({success:false,message:"Category already exists!"});
    }catch(error) {
        console.log("Error in adding category");
    }

    
}

const fetchCategory= async (req,res)=>{

    try {
        const{search,page}= req.query

        const query= search ? {name:{ $regex:search,$options:"i" }} : {};
        const limit=5;
        const skip= (Number(page)-1)*limit || 0;

        const total_doc= await Category.countDocuments(query);
        const docs= await Category.aggregate([{
            $match:query
        },{
            $skip:skip
        },{
            $limit:limit
        },{
            $lookup:{
                from:"products",
                localField:"_id",
                foreignField:"category_id",
                as:"productList"
            }
        },{
            $addFields:{total_products:{$size:"$productList"}}
        },{
            $project:{productList:0}
        }]);

        return res.status(200).send({docs,total_doc,limit});

    } catch (error) {
        console.log("Error in fetching category",error);
    }
}

const editCategory= async(req,res) =>{

    let {id,data}= req.body;

    try{

        let doc= await Category.findOne({name:{$regex:data.name,$options:"i"},_id:{$ne:id}});

        if(doc) {
            return res.status(409).send({success:false,message:"Category already exists!"});
        }
        

        await Category.updateOne({_id:id},{
            name:data.name,
            description:data.description,
            status:data.status
        });


        //product list/unlist logic

        let updated_category= await Category.findOne({_id:id});
        const products = await Product.find({category_id:id});

        for(let product of products) {

            let brand= await Brand.findOne({_id:product.brand_id});

            let final_status= brand.status && updated_category.status;

            await Product.updateOne({_id:product.id},{$set:{status:final_status}});
        }

        return res.status(200).send({success:true,message:"Category Updated"});

    }catch(error) {
        console.log("Error in editCategory",error);
    }
}

const getAllCategoryForUser= async(req,res)=> {

    try{
        
    const docs=await Category.find({},{name:1});

    return res.status(200).send({data:docs});

    }catch(error) {
        console.log("Error in getAllCategoryForUser")
    }

}

export { addcategory,fetchCategory,editCategory,getAllCategoryForUser }