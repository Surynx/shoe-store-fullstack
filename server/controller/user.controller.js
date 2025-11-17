import { compare, hash } from "bcrypt";
import User from "../models/user.model.js"
import Otp from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import createNewOtp from "../utils/otp.utils.js";

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        let exist = await User.findOne({ email });

        if (exist) {
            return res.status(200).send({ success: false })
        }

        const saltRound = 5;
        const hashed_pass = await hash(password, saltRound);

        let user = await User.create({
            name,
            email,
            password: hashed_pass,
        });

        await user.save();

        res.status(200).send({ success: true });

    } catch (error) {

        console.log("error in user register", error);
    }
}

const generateOtp= async(req,res)=>{

    try{
    const {email} = req.body;

    const otp_generated = createNewOtp();

        console.log("OTP: "+otp_generated);

        let otp = await Otp.create({
            email,
            code: otp_generated
        });

        await otp.save();

        return res.status(200).send({success:true});

    }catch(err) {

        console.log("Error in Otp Gneration");
    }

}

const verifyEmail = async (req, res) => {

    try {

        const { otp, email } = req.body;

        let doc = await Otp.findOne({ email });

        if (doc?.code == otp) {
            res.status(200).send({ success: true, message: "Email Verified" });
            await Otp.deleteOne({email});
        } else {
            res.status(200).send({ success: false, message: "Wrong Otp" });
        }
    }catch(error) {
        console.log("Error in verifyEmail");
    }

}

const verifyUser = async (req, res) => {

    try{

    const { email } = req.body;
    await User.updateOne({ email }, { isVerified: true });
    return res.status(200).send({success:true,message:"User Verified..!"});

    }catch(error) {
        console.log("Error in verifyUser");
    }
}

const userLogin = async (req,res) => {
    try{

        const {email,password} = req.body;

        let doc= await User.findOne({email});

        if(!doc) {
            return res.status(404).send({success:false,message:"User not found"});
        }

        let isMatch=await compare(password,doc.password);

        if(!isMatch) {
            return res.status(401).send({success:false,message:"Invalid password"});
        }

        if(doc.isBlock) {
            return res.status(403).send({success:false,message:"Blocked By Admin"});
        }

        if(doc.isVerified) {

            const payload= {email:doc.email};
            const token= jwt.sign(payload,process.env.Jwt_Key_User);

            return res.status(200).send({success:true,message:"Login Success",token});

        }else {
            return res.status(403).send({success:false,message:"notVerified"});
        }

    }catch(error) {
        console.log("Error in login");
    }
}

const resetPassword= async(req,res)=>{
    const {newpassword,email} = req.body;

    const doc = await User.findOne({email});

    if(!doc) {
        return res.status(404).send({success:false,message:"User not found"});
    }

    const saltRound = 5;
    const hashed_pass = await hash(newpassword, saltRound);

    await User.updateOne({email},{password:hashed_pass});

    return res.status(200).send({success:true,message:"Reset Success"});
}

const googleAuth= async(req,res)=>{

    const user = req.user;

    if(user.isBlock) {
        return res.redirect(`${process.env.Client_LocalHost}/login`);
    }
    
    if(user) {

        const payload = {email:user.email};
        const token= await jwt.sign(payload,process.env.Jwt_Key_User);

        return res.redirect(`${process.env.Client_LocalHost}/auth/google/success/${token}`);
    }
}

export { register, verifyEmail, verifyUser,userLogin,generateOtp,resetPassword,googleAuth }