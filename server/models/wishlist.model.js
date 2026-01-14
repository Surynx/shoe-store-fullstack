import moongose from "mongoose";

const itemSchema= new moongose.Schema({
    product_id:{
        type:moongose.Schema.ObjectId,
        required:true,
        ref:"products"
    },
    variant_id:{
        type:moongose.Schema.ObjectId,
        required:true,
        ref:"variants"
    }
});

const wishlistSchema= new moongose.Schema({
    user_id:{
        type:moongose.Schema.ObjectId,
        required:true,
        ref:"users"
    },
    items:[itemSchema],

},{timestamps:true});

const Wishlist= moongose.model("wishlists",wishlistSchema);

export default Wishlist;