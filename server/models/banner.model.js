import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    position:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5],
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    sub_title:{
        type:String,
        required:true
    }
},{timestamps:true});

const Banner = mongoose.model("banners",bannerSchema);

export default Banner;