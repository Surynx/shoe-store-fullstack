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

const fetchShopProducts = async (req, res) => {
  try {
    const {
      brand,
      gender,
      type,
      price,
      size,
      category,
      sort,
      search
    } = req.body;

    const actual_price = price ? (10000 - price) : null;

    let sortOrder = {};
    switch (sort) {
      case "priceHtoL":
        sortOrder = { display_price: -1 };
        break;
      case "priceLtoH":
        sortOrder = { display_price: 1 };
        break;
      case "atoz":
        sortOrder = { name: 1 };
        break;
      case "ztoa":
        sortOrder = { name: -1 };
        break;
      default:
        break;
    }

    const matchQuery = {};

    if (category?.length) matchQuery.category_name = { $in: category };
    if (gender?.length) matchQuery.gender = { $in: gender };
    if (brand?.length) matchQuery.brand_name = { $in: brand };
    if (type?.length) matchQuery.type = { $in: type };
    if (search?.length)
      matchQuery.name = { $regex: search, $options: "i" };

    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand"
        }
      },
      { $unwind: "$brand" },

      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "product_id",
          as: "variants"
        }
      },

      /* 🔥 FILTER VARIANTS FIRST */
      {
        $addFields: {
          category_name: "$category.name",
          brand_name: "$brand.name",
          filtered_variants: {
            $filter: {
              input: "$variants",
              as: "v",
              cond: {
                $and: [
                  actual_price !== null
                    ? { $lte: ["$$v.sales_price", actual_price] }
                    : true,
                  size ? { $eq: ["$$v.size", size] } : true
                ]
              }
            }
          }
        }
      },

      /* ❌ REMOVE PRODUCTS WITH NO VALID VARIANTS */
      {
        $match: {
          "filtered_variants.0": { $exists: true }
        }
      },

      /* ✅ PICK DISPLAY VARIANT (CHEAPEST) */
      {
        $addFields: {
          filtered_variants: {
            $sortArray: {
              input: "$filtered_variants",
              sortBy: { sales_price: 1 }
            }
          },
          display_variant: { $arrayElemAt: ["$filtered_variants", 0] }
        }
      },

      /* ✅ SINGLE SOURCE OF TRUTH */
      {
        $addFields: {
          display_price: "$display_variant.sales_price",
          total_stock: { $sum: "$filtered_variants.stock" }
        }
      },

      { $match: matchQuery },

      {
        $project: {
          category: 0,
          brand: 0,
          variants: 0,
          filtered_variants: 0
        }
      }
    ];

    if (Object.keys(sortOrder).length) {
      pipeline.push({ $sort: sortOrder });
    }

    const docs = await Product.aggregate(pipeline);

    /* OFFER LOGIC (UNCHANGED) */
    const categoryOffers = await Offer.find({
      apply_for: "category",
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() }
    });

    const productOffers = await Offer.find({
      apply_for: "product",
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() }
    });

    const offerProducts = docs.map(product => {
      const categoryOff = categoryOffers.filter(
        o => String(o.category_id) === String(product.category_id)
      );

      const productOff = productOffers.filter(
        o => String(o.product_id) === String(product._id)
      );

      const bestOffer = findBestOffer(
        [...categoryOff, ...productOff],
        product.display_price
      );

      return { ...product, bestOffer };
    });

    res.status(200).json({ offerProducts });

  } catch (error) {
    console.error("Error in fetchShopProducts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



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