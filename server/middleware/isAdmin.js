import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js";

export const isAdmin= async(req,res,next)=>{

    if(req?.headers?.authorization?.startsWith("Bearer")) {

        let token= req.headers.authorization.split(" ")[1];
        
        let decode= jwt.verify(token,process.env.Jwt_Key_Admin);

        const email=decode.admin_email;

        const admin= await Admin.findOne({email});

        if(!admin) {
            return res.status(404).send("Admin not Found");
        }

        next();

    }else {
        return res.status(401).send("UnAuthorized Access Denied");
    }
}