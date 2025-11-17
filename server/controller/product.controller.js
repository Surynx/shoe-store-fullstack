import mongoose from "mongoose";
import Product from "../models/product.model.js";


const addProduct= async(req,res)=>{

    const { name,brand_id } = req.body;

    let doc = await Product.findOne({name:{$regex:name,$options:"i"},brand_id});

    if(doc) {
        return res.status(409).send({message:"Product in this Brand exists!"});
    }

    try{
    
    const files=req.files;
    const productImageArray= files.map((obj)=>{
        return obj.path
    });

    const { description,category_id,type,status,gender }= req.body;

    let doc= await Product.create({
        category_id,
        brand_id,
        name,
        gender,
        type,
        description,
        productImages:productImageArray,
        status
    });

    if(doc) {
        res.status(200).send({message:"Product Added successfully!"});
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
        const skip= (Number(page)-1)*limit;

        const total_doc= await Product.countDocuments(query);
        const docs= await Product.find(query).sort({createdAt:-1}).skip(skip).limit(limit).populate("category_id","name").populate("brand_id","logo");

        return res.status(200).send({docs,total_doc,limit});

    }catch(error) {
        console.log("Error in product Fetching!",error);
    }
}

const editProduct= async(req,res)=> {

    try {

        const { name,brand_id } = req.body;

        const {id}= req.params;
 
        let doc = await Product.findOne({_id:{$ne:id},name:{$regex:name,$options:"i"},brand_id});

        if(doc) {
        return res.status(409).send({message:"Product in this Brand exists!"});
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

         res.status(200).send({message:"Product Updated!"});


    }catch(error) {
        console.log("Error in editProduct",error);
    }
}

export { addProduct,fetchProduct,editProduct }