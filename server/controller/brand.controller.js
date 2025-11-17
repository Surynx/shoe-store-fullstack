import Brand from "../models/brand.model.js";
import Category from "../models/category.model.js";

const addBrand= async(req,res)=>{

    try{
    const {name,status} = req.body;
    const {path} = req.file;

    let doc= await Brand.findOne({name:{$regex:name,$options:"i"}});

    if(doc) {
        return res.status(409).send({message:"Brand Already Exists!"});
    }

    await Brand.create({
        name,
        logo:path,
        status
    });

    return res.status(200).send({message:"Brand Added Successfully!"});
    
    }catch(error) {
        console.log("Error in Adding Brand!",error);
    }

}

const fetchBrands= async(req,res)=>{
   try {

    const {search,page} = req.query;
    const query= search ? {name:{$regex:search,$options:"i"}} : {};
    const limit=5;
    const skip= (Number(page)-1)*limit;

    const total_doc= await Brand.countDocuments(query);
    const docs= await Brand.find(query).sort({createdAt:-1}).skip(skip).limit(limit);

    return res.status(200).send({docs,total_doc,limit});

   }catch(error) {
    console.log("Error in fetching Brands");
   }
}

const editBrand= async(req,res)=>{

    const {id}= req.params;
    const {name,status} = req.body;

    let doc= await Category.findOne({name:{$regex:name,$options:"i"}});

        if(doc) {
            return res.status(409).send({success:false,message:"Brand already exists!"});
        }

    if(req.file) {

        const {path}= req.file;

        await Brand.updateOne({_id:id},{
            name,
            status,
            logo:path
        });

        return res.status(200).send({message:"Brand Updated!"});
    }

    await Brand.updateOne({_id:id},{
        name,
        status
    });

    return res.status(200).send({message:"Brand Updated!"});
}

export {addBrand,fetchBrands,editBrand}