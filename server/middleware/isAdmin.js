import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js";
import STATUS from "../constants/status.constant.js";

export const isAdmin= async(req,res,next)=>{
    try{

    if(req?.headers?.authorization?.startsWith("Bearer")) {

        let token= req.headers.authorization.split(" ")[1];
        
        let decode= jwt.verify(token,process.env.Jwt_Key_Admin);

        const email=decode.admin_email;

        const admin= await Admin.findOne({email});

        if(!admin) {
            return res.status(STATUS.ERROR.NOT_FOUND).send("Admin not Found");
        }

        next();

    }else {
        return res.status(STATUS.ERROR.FORBIDDEN).send("UnAuthorized Access Denied");
    }
    }catch(error) {
        error.response.redirect("/admin/login");
    }
}