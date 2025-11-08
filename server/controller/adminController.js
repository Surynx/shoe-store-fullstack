import { compare } from "bcrypt";
import { addAdminService, verifyAdminService } from "../services/adminService.js"


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


export { addAdmin,verifyAdmin }