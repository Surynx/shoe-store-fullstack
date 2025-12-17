import { findBestOffer } from "../../computation/offer.computation.js";
import STATUS from "../../constants/status.constant.js";
import Offer from "../../models/offer.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import Variant from "../../models/variant.model.js";
import Wishlist from "../../models/wishlist.model.js";
import { cleanWishlistDoc } from "../../utils/wishlist.util.js";

const addProductToWishlist= async(req,res)=> {
    try{

        const { product_id, variant_id }= req.body;

        const email= req.email;

        const user= await User.findOne({email});

        const wishlistDoc= await Wishlist.findOne({user_id:user._id});

        const variantDoc= await Variant.findById({_id:variant_id});

        const productDoc= await Product.findById({_id:product_id});
        
        if(!variantDoc) {

        return res.status(STATUS.ERROR.CONFLICT).send({success:false,message:`${productDoc.name} is currentlty unavailable`});
        }

        if(!wishlistDoc) {

        await Wishlist.create({
            user_id:user._id,
            items:[{ product_id,variant_id }]
        });

        return res.status(STATUS.SUCCESS.CREATED).send({success:true});
        }

        const variant_exist= wishlistDoc.items.filter((obj)=> obj.variant_id == variant_id);
        
        if(variant_exist.length > 0) {
        
            return res.status(STATUS.ERROR.CONFLICT).send({ success:false,message:`${productDoc.name} of size ${variantDoc.size} Already Exists!` });
        }

        wishlistDoc.items.unshift({ product_id,variant_id });
    
        await wishlistDoc.save();

        return res.status(STATUS.SUCCESS.OK).send({success:true});

    }catch(err) {
        console.log("Error in Add To Wishlist",err);
    }
}

const fetchWishlistInfo= async(req,res)=> {

    const email= req.email;

    const user= await User.findOne({email});

    const wishlistDoc= await Wishlist.findOne({user_id:user._id}).populate("items.product_id").populate("items.variant_id");

    const wishlistItem= cleanWishlistDoc(wishlistDoc);

    const wishListItemsWithOffers= await Promise.all(wishlistItem.map( async(item)=> {

        const offers= await Offer.find({$or:[{category_id:item.category_id},{product_id:item.product_id}], start_date:{ $lte:new Date() },end_date:{ $gte:new Date()}})
        const bestOffer = findBestOffer(offers,item.sales_price);

        return {...item,bestOffer:bestOffer}
    }));

    res.status(STATUS.SUCCESS.OK).send({wishListItemsWithOffers});
}

const removeItemFromWishlist= async(req,res)=> {

    const {id}= req.params;
    const email= req.email;

    const user= await User.findOne({email});

    const wishlistDoc= await Wishlist.updateOne({user_id:user._id},{$pull:{items:{_id:id}}});

   return res.status(STATUS.SUCCESS.OK).send({success:true});
   
}

export { addProductToWishlist,fetchWishlistInfo,removeItemFromWishlist }