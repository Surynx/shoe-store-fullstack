import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken"
import Admin from "../../models/admin.model.js";
import STATUS from "../../constants/status.constant.js";
import User from "../../models/user.model.js";


const addAdmin = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        let saltRound = 5;
        const hashed = await hash(password, saltRound);

        let admin = await Admin.create({
            name,
            email,
            password: hashed
        });

        await admin.save();
        console.log("created");


    } catch (error) {

        console.log("error in admin creation", error);
    }

}

const verifyAdmin = async (req, res) => {

    const {email,password} = req.body;

    try {

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return { valid: false };
        }

        let valid = await compare(password, admin.password);

        let payload = { admin_email: admin.email }
        const token = jwt.sign(payload, process.env.JWT_KEY_ADMIN);

        if (valid) {
            res.status(STATUS.SUCCESS.OK).send({ success: true, token });
        } else {
            res.status(STATUS.SUCCESS.OK).send({ success: false });
        }

    }catch(error){
        console.log("Error in verify admin",error);
    }

   
}

const fetchUsers = async (req, res) => {

    try {

        const { search = "", page = 1 } = req.query;

        const limit = 11;
        const skip = (Number(page) - 1) * limit

        const query = (search) ? {
            email: { $regex: search, $options: "i" }
        } : {}

        const userDocs = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const total_doc = await User.countDocuments(query);

        return res.status(STATUS.SUCCESS.OK).send({ userDocs, total_doc, limit });

    } catch (error) {

        console.log("Error in fetching Users");
    }

}

const blockUser = async (req, res) => {
    
    const { id, isBlock } = req.body;

    await User.updateOne({ _id: id }, { isBlock: !isBlock });

    return res.status(STATUS.SUCCESS.OK).send({ success: true, isBlock: !isBlock });

}


export { addAdmin, verifyAdmin, fetchUsers, blockUser }