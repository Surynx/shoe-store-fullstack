import { addAdminService, verifyAdminService } from "../services/adminService.js"
import User from "../models/userModel.js";



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
        res.status(200).send({success:false})
   }
}

const fetchUsers= async(req,res)=>{
    
    let usersInfo= await User.find();
    return res.status(200).json(usersInfo);
}

const blockUser= async(req,res)=>{
    const {id,isBlock}= req.body;

    await User.updateOne({_id:id},{isBlock:!isBlock});

    return res.status(200).send({success:true});
    
}


export { addAdmin,verifyAdmin,fetchUsers,blockUser }