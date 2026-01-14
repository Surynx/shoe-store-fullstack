import { findBestOffer } from "../../computation/offer.computation.js";
import STATUS from "../../constants/status.constant.js";
import Offer from "../../models/offer.model.js";
import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";

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

        const categoryOffers= await Offer.find({apply_for:"category",start_date:{ $lte:new Date() },end_date:{ $gte:new Date() }});
        const productOffers= await Offer.find({apply_for:"product", start_date:{ $lte:new Date() },end_date:{ $gte:new Date() } })
 
        const offerProducts= docs.map((product)=> {

            const categoryOff = categoryOffers.filter((offer)=> String(offer.category_id) == String(product.category_id));
            const productOff = productOffers.filter((offer)=> String(offer.product_id) == String(product._id));

            let offers=[...categoryOff,...productOff];

            const bestOffer= findBestOffer(offers,product.min_price);
    
            return {...product,bestOffer}

        });

        res.status(STATUS.SUCCESS.OK).send({offerProducts});

    }catch(error) {

        console.log("Error in fetchShopProducts",error);
    }
    
}

const fetchProductData= async(req,res)=> {

    try{
    const {id}= req.params;
    
    const productDoc=await Product.findById({_id:id}).populate("category_id");
    
    const variant_array= await Variant.find({product_id:id}).sort({sales_price:1});

    const relatedProducts= await Product.aggregate([{
        $match:{category_id:productDoc.category_id._id,_id:{$ne:productDoc._id}}
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

    const offers= await Offer.find({$or:[{category_id:productDoc.category_id._id},{product_id:productDoc._id}],start_date:{ $lte:new Date() },end_date:{ $gte:new Date() }});

    return res.status(STATUS.SUCCESS.OK).send({ productDoc,variant_array,relatedProducts,offers });

    }catch(error) {

        console.log("Error in fetchProductData",error);
    }

}

export { fetchLatestProduct,fetchShopProducts,fetchProductData }