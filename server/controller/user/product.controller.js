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

    const query = {};
    let sortOrder = {};

    /* -------------------- SORT -------------------- */
    switch (sort) {
      case "priceHtoL":
        sortOrder = { min_price: -1 };
        break;
      case "priceLtoH":
        sortOrder = { min_price: 1 };
        break;
      case "atoz":
        sortOrder = { name: 1 };
        break;
      case "ztoa":
        sortOrder = { name: -1 };
        break;
    }

    /* -------------------- FILTERS -------------------- */
    if (category?.length) {
      query.category_name = { $in: category };
    }

    if (gender?.length) {
      query.gender = { $in: gender };
    }

    if (brand?.length) {
      query.brand_name = { $in: brand };
    }

    if (type?.length) {
      query.type = { $in: type };
    }

    /* -------------------- VARIANT FILTER -------------------- */
    if (price || size) {
      query.variants = {
        $elemMatch: {
          ...(price && { sales_price: { $lte: price } }),
          ...(size && { size })
        }
      };
    }

    if (search?.trim()) {
      query.name = { $regex: search, $options: "i" };
    }

    /* -------------------- AGGREGATION -------------------- */
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

      /* ---------- COMPUTED FIELDS ---------- */
      {
        $addFields: {
          category_name: "$category.name",
          brand_name: "$brand.name",
          total_stock: { $sum: "$variants.stock" },
          min_price: { $min: "$variants.sales_price" },
          variant_array: {
            $sortArray: {
              input: "$variants",
              sortBy: { sales_price: 1 }
            }
          }
        }
      },

      /* ---------- APPLY FILTERS ---------- */
      { $match: query },

      /* ---------- CLEAN RESPONSE ---------- */
      {
        $project: {
          category: 0,
          brand: 0,
          variants: 0
        }
      }
    ];

    if (Object.keys(sortOrder).length) {
      pipeline.push({ $sort: sortOrder });
    }

    const products = await Product.aggregate(pipeline);

    /* -------------------- OFFERS -------------------- */
    const now = new Date();

    const categoryOffers = await Offer.find({
      apply_for: "category",
      start_date: { $lte: now },
      end_date: { $gte: now }
    });

    const productOffers = await Offer.find({
      apply_for: "product",
      start_date: { $lte: now },
      end_date: { $gte: now }
    });

    const offerProducts = products.map(product => {
      const catOffers = categoryOffers.filter(
        o => String(o.category_id) === String(product.category_id)
      );

      const prodOffers = productOffers.filter(
        o => String(o.product_id) === String(product._id)
      );

      const bestOffer = findBestOffer(
        [...catOffers, ...prodOffers],
        product.min_price
      );

      return { ...product, bestOffer };
    });

    return res.status(200).json({ offerProducts });

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