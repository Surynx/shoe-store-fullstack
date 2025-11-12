import { addAdminService, verifyAdminService } from "../services/adminService.js"
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";


const addAdmin = async(req,res)=>{

    const admin=await addAdminService(req.body);

    if(admin){
        console.log("created");
    }

}

const verifyAdmin=async (req,res) => {

   const {valid,token} = await verifyAdminService(req.body);

   if(valid) {
        res.status(200).send({success:true,token});
   }else{
        res.status(200).send({success:false});
   }
}

const fetchUsers= async(req,res)=>{

    try{
    
    const { search="",page=1 } = req.query;

    const limit=11;
    const skip= (Number(page)-1)*limit

    const query = (search) ? {
        email:{ $regex:search , $options:"i" }
    } : {}

    const userDocs= await User.find(query).sort({createdAt:-1}).skip(skip).limit(limit); 

    const total_doc= await User.countDocuments(query);

    return res.status(200).send({userDocs,total_doc,limit});

    }catch(error) {

        console.log("Error in fetching Users");
    }

}



const blockUser= async(req,res)=>{
    const {id,isBlock}= req.body;

    await User.updateOne({_id:id},{isBlock:!isBlock});

    return res.status(200).send({success:true,isBlock:!isBlock});
    
}

const addcategory= async(req,res)=> {

    try{
    const { name,description,status } = req.body;
    let doc = await Category.findOne({name});

    if(!doc) {
        await Category.create({
        name,
        description,
        status
    });
       
        return res.status(200).send({success:true,message:"New Category Added!"});
    }

    return res.status(409).send({success:false,message:"Category already exists!"});
    }catch(error) {
        console.log("Error in adding category");
    }

    
}

const fetchCategory= async (req,res)=>{

    try {
        const{search,page}= req.query

        const query= search ? {name:{ $regex:search,$options:"i" }} : {};
        const limit=5;
        const skip= (Number(page)-1)*limit;

        const total_doc= await Category.countDocuments(query);
        const docs= await Category.find(query).sort({createdAt:-1}).skip(skip).limit(limit);

        return res.status(200).send({docs,total_doc,limit});

    } catch (error) {
        console.log("Error in fetching category");
    }
}

const editCategory= async(req,res) =>{
    let {id,data}= req.body;
    try{

        await Category.updateOne({_id:id},{
            name:data.name,
            description:data.description,
            status:data.status
        });

        return res.status(200).send({success:true,message:"Category Updated"});

    }catch(error) {
        console.log("Error in editCategory",error);
    }
}

const addBrand= async(req,res)=>{

    try{
    const {name,status} = req.body;
    const {path} = req.file;

    let doc= await Brand.findOne({name});

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

export { addAdmin,verifyAdmin,fetchUsers,blockUser,addcategory,fetchCategory,editCategory,addBrand,fetchBrands,editBrand }