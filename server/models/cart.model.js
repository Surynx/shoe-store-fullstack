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
    },
    quantity:{
        type:Number,
        default:1,
        min:1
    }
});

const cartSchema= new moongose.Schema({
    user_id:{
        type:moongose.Schema.ObjectId,
        required:true,
        ref:"users"
    },

    items:[itemSchema]

},{timestamps:true});

const Cart= moongose.model("carts",cartSchema);

export default Cart;