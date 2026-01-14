import jwt from "jsonwebtoken"
import STATUS from "../constants/status.constant.js";

export const isUser= async(req,res,next)=> {

    try {
        if(req?.headers?.authorization?.startsWith("Bearer")) {

            let token= req.headers.authorization.split(" ")[1];
            let decode= jwt.verify(token,process.env.JWT_KEY_USER);

            const userMail= decode.email
            req.email= userMail;

            next();

        }else {
            return res.status(STATUS.ERROR.FORBIDDEN).send("UnAuthorized Access Denied")
        }
    }catch(error) {

        console.log(error);
    }

}