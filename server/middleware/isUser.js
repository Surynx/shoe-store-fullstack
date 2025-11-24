// import jwt from "jsonwebtoken"
// import User from "../models/user.model"

// const isUser= async(req,resizeBy,next)=> {

//     try {
//         if(req?.headers?.authorization.startsWith("Bearer")) {

//             let token= req.headers.authorization.split(" ")[1];
//             let decode= jwt.verify(token,process.env.Jwt_Key_User);

//             const userMail= decode.email
//             req.body= userMail;
//         }
//     }

// }