import { addAdminService, verifyAdminService } from "../services/admin.service.js"
import User from "../models/user.model.js";
import STATUS from "../constants/status.constant.js";


const addAdmin = async(req,res)=>{

    const admin=await addAdminService(req.body);

    if(admin){
        console.log("created");
    }

}

const verifyAdmin=async (req,res) => {

   const {valid,token} = await verifyAdminService(req.body);

   if(valid) {
        res.status(STATUS.SUCCESS.OK).send({success:true,token});
   }else{
        res.status(STATUS.SUCCESS.OK).send({success:false});
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

    return res.status(STATUS.SUCCESS.OK).send({userDocs,total_doc,limit});

    }catch(error) {

        console.log("Error in fetching Users");
    }

}

const blockUser= async(req,res)=>{
    const {id,isBlock}= req.body;

    await User.updateOne({_id:id},{isBlock:!isBlock});

    return res.status(STATUS.SUCCESS.OK).send({success:true,isBlock:!isBlock});
    
}


export { addAdmin,verifyAdmin,fetchUsers,blockUser }