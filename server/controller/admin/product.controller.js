import STATUS from "../../constants/status.constant.js";
import Product from "../../models/product.model.js";

const addProduct= async(req,res)=>{

    const { name,brand_id } = req.body;

    let doc = await Product.findOne({name:{$regex:name,$options:"i"},brand_id});

    if(doc) {
        return res.status(STATUS.ERROR.CONFLICT).send({message:"Product in this Brand exists!"});
    }

    try{
    
    const files=req.files;
    const productImageArray= files.map((obj)=>{
        return obj.path
    });

    const { description,category_id,type,status,gender }= req.body;

    const caps_name= name.split("")[0].toUpperCase()+name.slice(1);

    let doc= await Product.create({
        category_id,
        brand_id,
        name:caps_name,
        gender,
        type,
        description,
        productImages:productImageArray,
        status
    });

    if(doc) {
        res.status(STATUS.SUCCESS.CREATED).send({message:"Product Added successfully!"});
    }

    }catch(error) {
        console.log("error in product adding",error);
    }

}

const fetchProduct= async(req,res)=> {

    try{

        const { search,page }= req.query;

        const query= search ? {name:{ $regex:search,$options:"i" }} : {};
        const limit=10;
        const skip= (Number(page)-1)*limit || 0;

        const total_doc= await Product.countDocuments(query);
        
        const docs= await Product.aggregate([{
            $match:query
        },{
            $sort:{createdAt:-1}
        },{
            $skip:skip
        },{
            $limit:limit
        },{
            $lookup:{
                from:"categories",
                localField:"category_id",
                foreignField:"_id",
                as:"category"
            }
        },{
            $unwind:"$category"
        },{
            $lookup:{
                from:"brands",
                localField:"brand_id",
                foreignField:"_id",
                as:"brand"
            }
        },{
            $unwind:"$brand"
        },{
            $lookup:{
                from:"variants",
                localField:"_id",
                foreignField:"product_id",
                as:"variantList"
            }
        },{
            $addFields:{stock:{$sum:"$variantList.stock"}}
        },{
            $project:{variantList:0,category:{_id:0,description:0,createdAt:0,updatedAt:0,status:0},
            brand:{_id:0,description:0,createdAt:0,updatedAt:0,status:0,name:0}}
        }]);

        return res.status(STATUS.SUCCESS.OK).send({docs,total_doc,limit});

    }catch(error) {
        console.log("Error in product Fetching!",error);
    }
}

const editProduct= async(req,res)=> {

    try {

        const { name,brand_id } = req.body;

        const {id}= req.params;
 
        let doc = await Product.findOne({_id:{$ne:id},name:{$regex:name,$options:"i"},brand_id:brand_id});

        if(doc) {
        return res.status(STATUS.ERROR.CONFLICT).send({message:"Product in this Brand exists!"});
        }

        let productImages=[];

        if(req.body.existingImages != '') {

           let existingImages= JSON.parse(req.body.existingImages);
           existingImages.forEach((url)=>productImages.push(url));
        }

        if(req.files) {

            req.files.forEach((file)=>productImages.push(file.path));
        }

        const { description,category_id,type,status,gender }= req.body;

        await Product.updateOne({_id:id},{
            category_id,
            brand_id,
            name,
            gender,
            type,
            description,
            productImages:productImages,
            status
         });

         res.status(STATUS.SUCCESS.OK).send({message:"Product Updated!"});


    }catch(error) {
        console.log("Error in editProduct",error);
    }
}

export { addProduct,fetchProduct,editProduct }