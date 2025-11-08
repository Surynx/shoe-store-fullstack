import { compare, hash } from "bcrypt";
import User from "../models/userModel.js"
import otpGenerator from "otp-generator"
import Otp from "../models/otpModel.js";

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

    const otp_generated = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

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

        if(doc.isVerified) {
            return res.status(200).send({success:true,message:"Login Success"});
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

export { register, verifyEmail, verifyUser,userLogin,generateOtp,resetPassword }