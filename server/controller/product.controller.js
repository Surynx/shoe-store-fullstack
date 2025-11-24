import STATUS from "../constants/status.constant.js";
import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";

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

const fetchLatestProduct= async(req,res)=>{

    try{

    const docs= await Product.aggregate([
        {
        $sort:{createdAt:-1}
        },{
            $limit:8
        },{
            $lookup:{
                from:"variants",
                localField:"_id",
                foreignField:"product_id",
                as:"variantsList"
            }
        },{
            $addFields:{
                variants:{
                   $sortArray:{input:"$variantsList",sortBy:{sales_price:1}}
                },
                total_stock:{
                    $sum:"$variantsList.stock"
                }
            }
        },{
            $project:{variantsList:0}
        }]);

    return res.status(STATUS.SUCCESS.OK).send({data:docs});

    }catch(error) {

        console.log("Error in LatestProduct Fetch",error);
    }
}

const fetchShopProducts= async(req,res)=> {

    try{

        const { brand,gender,type,price,size,category,sort,search }= req.body;
        
        const actual_price= (10000-price)
        
        const query= {} 

        let sortOrder;

        switch(sort) {

            case "priceHtoL":
                sortOrder={min_price:-1}
                break;
            case "priceLtoH":
                sortOrder={min_price:1}
                break;
            case "atoz":
                sortOrder={name:1}
                break;
            case "ztoa":
                sortOrder={name:-1}
                break;
            default:
                sortOrder={}
                break;
        }

        if(category && category.length > 0) {
            query.category_name={$in:[...category]}
        }

        if(gender && gender.length > 0) {
            query.gender={$in:[...gender]}
        }

        if(brand && brand.length > 0) {
            query.brand_name={$in:[...brand]}
        }

        if(type && type.length > 0) {
            query.type= {$in:[...type]}
        }

        if(size && price) {

            query.variant_array={$elemMatch:{sales_price:{$lte:actual_price},size:{$eq:size}}}

        }else if(price) {

            query.variant_array={$elemMatch:{sales_price:{$lte:actual_price}}}

        }else if(size) {

            query.variant_array={$elemMatch:{size:{$eq:size}}}

        }

        if(search && search.length > 0) {
            query.name={$regex:search,$options:"i"}
        }

        const pipeline=[{
            $lookup:{
                from:"categories",
                localField:"category_id",
                foreignField:"_id",
                as:"category"
            }},{
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
                    as:"variants"
                }
            },{
                $addFields:{
                    category_name:"$category.name",
                    brand_name:"$brand.name",
                    total_stock:{$sum:"$variants.stock"},
                    variant_array:{$sortArray:{input:"$variants" ,sortBy:{sales_price:1}}},
                    min_price:{$min:"$variants.sales_price"}
                }
            },{
                $match:query
            },{
                $project:{category:0,brand:0,variants:0}
            }
        ]

        if(Object.keys(sortOrder).length > 0) {

            pipeline.push({$sort:sortOrder});
        }

        const docs= await Product.aggregate(pipeline);
        // console.log(docs)

        res.status(STATUS.SUCCESS.OK).send({docs});

    }catch(error) {

        console.log("Error in fetchShopProducts",error);
    }
    
}

const fetchProductData= async(req,res)=> {

    try{
    const {id}= req.params;
    
    const productDoc=await Product.findById({_id:id});
    const variant_array= await Variant.find({product_id:id});

    const relatedProducts= await Product.aggregate([{
        $match:{category_id:productDoc.category_id,_id:{$ne:productDoc._id}}
    },{
        $lookup:{
            from:"variants",
            localField:"_id",
            foreignField:"product_id",
            as:"variants"
        }},{
            $addFields:{
                total_stock:{$sum:"$variants.stock"},
                variant_array:{$sortArray:{input:"$variants",sortBy:{price:1}}}
            }
        },{
            $project:{variants:0}
        }
    ]);

    return res.status(STATUS.SUCCESS.OK).send({ productDoc,variant_array,relatedProducts });

    }catch(error) {

    }

}

export { addProduct,fetchProduct,editProduct,fetchLatestProduct,fetchShopProducts,fetchProductData }