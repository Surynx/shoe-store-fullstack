import Admin from "../models/admin.model.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const addAdminService = async ({ name,email, password }) => {

    try {

        let saltRound = 5;
        const hashed = await hash(password, saltRound);

        let admin = await Admin.create({
            name,
            email,
            password: hashed
        });

        await admin.save();
        return admin;

    } catch (error) {

        console.log("error in admin creation",error);
    }

}

const verifyAdminService=async({email,password})=>{

    try{

        const admin = await Admin.findOne({email});

        if(!admin) {
            return {valid:false};
        }

        let valid=await compare(password,admin.password);

        let payload={admin_email:admin.email}
        const token=jwt.sign(payload,process.env.Jwt_Key_Admin);

        return {valid,token};

    }catch(error){
        console.log("Error in verify admin",error);
    }
}

export { addAdminService,verifyAdminService }