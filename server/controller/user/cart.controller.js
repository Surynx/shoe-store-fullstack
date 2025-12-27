import { findBestOffer } from "../../computation/offer.computation.js";
import STATUS from "../../constants/status.constant.js";
import Cart from "../../models/cart.model.js";
import Offer from "../../models/offer.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import Variant from "../../models/variant.model.js";
import { cleanCartDoc } from "../../utils/cart.util.js";


const addToCart= async(req,res)=> {

    const { product_id, variant_id }= req.body;

    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.findOne({user_id:user._id});

    const variantDoc= await Variant.findById({_id:variant_id});

    const productDoc= await Product.findById({_id:product_id});

     if(!variantDoc) {
        return res.status(STATUS.ERROR.CONFLICT).send({success:false,message:`${productDoc.name} is currentlty unavailable`});
    }

    if(variantDoc.stock <= 0) {

        return res.status(STATUS.ERROR.CONFLICT).send({success:false,message:`The ${variantDoc.size} Size is unavailable for this product!`})
    }
 
    if(!cartDoc) {

        await Cart.create({
            user_id:user._id,
            items:[{ product_id,variant_id }]
        });

        return res.status(STATUS.SUCCESS.CREATED).send({success:true});
    }

    const variant_exist= cartDoc.items.filter((obj)=> obj.variant_id == variant_id);

    if(variant_exist.length > 0) {

        return res.status(STATUS.ERROR.CONFLICT).send({ success:false,message:`${productDoc.name} of size ${variantDoc.size} Already Exists!` });
    }

    cartDoc.items.unshift({ product_id,variant_id });
    
    await cartDoc.save();

    return res.status(STATUS.SUCCESS.OK).send({success:true});
    

}

const fetchCartInfo= async(req,res)=> {

    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.findOne({user_id:user._id}).populate("items.product_id").populate("items.variant_id");

    const cartItems= cleanCartDoc(cartDoc);

    const itemCount= cartItems.length || 0;

    const cartItemsWithOffers= await Promise.all(cartItems.map( async(item)=> {

        const offers= await Offer.find({$or:[{category_id:item.category_id},{product_id:item.product_id}], start_date:{ $lte:new Date() },end_date:{ $gte:new Date()}})
        const bestOffer = findBestOffer(offers,item.sales_price);

        return {...item,bestOffer:bestOffer}
    }));

    res.status(STATUS.SUCCESS.OK).send({cartItemsWithOffers,itemCount});
}

const removeItemFromCart= async(req,res)=> {

    const {id}= req.params;
    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.updateOne({user_id:user._id},{$pull:{items:{_id:id}}});

   return res.status(STATUS.SUCCESS.OK).send({success:true});
   
}

const incQuantity= async(req,res)=> {

    const {id}= req.params;
    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.findOne({user_id:user._id,"items._id":id}).populate("items.variant_id");

    const item = cartDoc.items[0];
    const stock = item.variant_id.stock;

    if (item.quantity+1 > stock) {
        
      return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Quantity not Available" });
    }

    await Cart.updateOne({user_id:user._id,"items._id":id},{$inc:{"items.$.quantity":1}});

   return res.status(STATUS.SUCCESS.OK).send({success:true});
   
}

const decQuantity= async(req,res)=> {

    const {id}= req.params;
    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.findOne({user_id:user._id,"items._id":id})
    
    const item = cartDoc.items[0];

    if (item.quantity === 1) {

      return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Quantity cannot go below 1." });
    }
    
    await Cart.updateOne({user_id:user._id,"items._id":id},{$inc:{"items.$.quantity":-1}});

   return res.status(STATUS.SUCCESS.OK).send({success:true});
   
}

const countCartItems= async(req,res)=> {

    const email=req.email;

    const user= await User.findOne({email});
    
    const cartDoc= await Cart.findOne({user_id:user._id});

    return res.status(STATUS.SUCCESS.OK).send({count:cartDoc.items.length});
}

const validateCartItems= async(req,res)=> {

    const email= req.email;

    const user= await User.findOne({email});

    const cartDoc= await Cart.findOne({user_id:user._id}).populate("items.product_id").populate("items.variant_id");

    if( !cartDoc || cartDoc.items.length <= 0 ) {

        res.status(STATUS.ERROR.BAD_REQUEST).send({success:false,message:"Looks like your cart is empty. Add some items to continue to checkout!"});
    }

    const cartItems= cleanCartDoc(cartDoc);

    const unlisted_product= cartItems.find((item)=> !item.status);

    const out_of_stock= cartItems.find(item=> item.stock <= 0);

    if(out_of_stock) {
        res.status(STATUS.ERROR.CONFLICT).send({success:false,message:`${out_of_stock.size} size is out of stock for ${out_of_stock.name} please remove the product from bag!`});
    }
    
    if(unlisted_product) {
        res.status(STATUS.ERROR.CONFLICT).send({success:false,message:`${unlisted_product.name} is currently unavailabe please remove the product from bag!`});

    }else {

        res.status(STATUS.SUCCESS.OK).send({success:true});

    }

}

export { addToCart,fetchCartInfo,removeItemFromCart,incQuantity,decQuantity,countCartItems,validateCartItems }