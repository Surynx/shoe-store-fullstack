import { compare, hash } from "bcrypt";
import User from "../../models/user.model.js"
import Otp from "../../models/otp.model.js";
import jwt from "jsonwebtoken";
import createNewOtp from "../../utils/otp.util.js";
import STATUS from "../../constants/status.constant.js";
import sendEmail from "../../utils/send-otp-mail.js";
import generateReferralCode from "../../utils/referral.util.js";
import Wallet from "../../models/wallet.model.js";

const register = async (req, res) => {

    try {

        const { name, email, password, referralCode } = req.body;

        let exist = await User.findOne({ email });

        if (exist) {
            return res.status(STATUS.ERROR.CONFLICT).send({ message: "Email Already Exist!" })
        }

        const saltRound = 5;
        const hashed_pass = await hash(password, saltRound);

        const referral_code = generateReferralCode();

        let user = await User.create({
            name,
            email,
            password: hashed_pass,
            referral_code
        });

        if (referralCode) {

            let referred_user = await User.findOne({ referral_code: referralCode });

            if (!referred_user) {
                return res.status(STATUS.ERROR.BAD_REQUEST).send({ message: "Invalid Coupon Code" });
            }

            user.referred_by = referred_user._id;
        }

        await user.save();

        res.status(STATUS.SUCCESS.OK).send({ success: true });

    } catch (error) {

        console.log("error in user register", error);
    }
}

const generateOtpForEmail = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({email});

        if( user.google_id ) {

            return res.status(STATUS.ERROR.BAD_REQUEST).json({message: "This account uses Google Sign-In. Please log in using Google."});
        }

        const exist = await Otp.findOne({ email });

        if (exist) {
            await Otp.deleteOne({ email });
        }

        const otp_generated = createNewOtp();

        console.log("OTP: " + otp_generated);

        await sendEmail(email, otp_generated);

        let otp = await Otp.create({
            email,
            code: otp_generated
        });

        await otp.save();

        return res.status(STATUS.SUCCESS.OK).send({ success: true });

    } catch (err) {

        console.log("Error in Otp Gneration", err);
    }

}

const verifyEmail = async (req, res) => {

    try {

        const { otp, email } = req.body;

        let doc = await Otp.findOne({ email });

        if (doc?.code == otp) {
            res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Email Verified" });
            await Otp.deleteOne({ email });
        } else {
            res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Wrong Otp" });
        }
    } catch (error) {
        console.log("Error in verifyEmail");
    }

}

const verifyUser = async (req, res) => {

    try {

        const { email } = req.body;
        await User.updateOne({ email }, { isVerified: true });
        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "User Verified..!" });

    } catch (error) {
        console.log("Error in verifyUser");
    }
}

const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        let doc = await User.findOne({ email });

        if (!doc) {
            return res.status(STATUS.ERROR.NOT_FOUND).send({ success: false, message: "User not found" });
        }

        let isMatch = await compare(password, doc.password);

        if (!isMatch) {
            return res.status(STATUS.ERROR.UNAUTHORIZED).send({ success: false, message: "Invalid password" });
        }

        if (doc.isBlock) {
            return res.status(STATUS.ERROR.FORBIDDEN).send({ success: false, message: "Blocked By Admin" });
        }

        if (doc.isVerified) {

            const payload = { email: doc.email };
            const token = jwt.sign(payload, process.env.Jwt_Key_User);

            return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Login Success", token });

        } else {
            return res.status(STATUS.ERROR.FORBIDDEN).send({ success: false, message: "notVerified" });
        }

    } catch (error) {
        console.log("Error in login");
    }
}

const resetPassword = async (req, res) => {
    const { newpassword, email } = req.body;

    const doc = await User.findOne({ email });

    if (!doc) {
        return res.status(STATUS.ERROR.NOT_FOUND).send({ success: false, message: "User not found" });
    }

    const saltRound = 5;
    const hashed_pass = await hash(newpassword, saltRound);

    await User.updateOne({ email }, { password: hashed_pass });

    return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Reset Success" });
}

const googleAuth = async (req, res) => {

    const user = req.user;

    if (user.isBlock) {
        return res.redirect(`${process.env.Client_LocalHost}/login`);
    }

    if (user) {

        const payload = { email: user.email };
        const token = await jwt.sign(payload, process.env.Jwt_Key_User);

        return res.redirect(`${process.env.Client_LocalHost}/auth/google/success/${token}`);
    }
}

const fetchUserInfo = async (req, res) => {

    try {

        const email = req.email;

        let userInfo = await User.findOne({ email });

        let referralCount = await User.countDocuments({ referred_by: userInfo._id });

        let wallet = await Wallet.findOne({user_id:userInfo._id}).select("balance");

        if (userInfo) {

            res.status(STATUS.SUCCESS.OK).send({ userInfo, referralCount, balance:wallet?.balance });
        } else {

            res.status(STATUS.ERROR.NOT_FOUND).send("User Not Found")
        }
    } catch (error) {
        console.log("Error in fetching user Info..", error);
    }
}

const editUserInfo = async (req, res) => {

    try {

        const userEmail = req.email;
        const { name, gender } = req.body;

        if (req.file) {

            const { path } = req.file;
            await User.updateOne({ email: userEmail }, {
                name,
                gender,
                profile_picture: path
            });

            return res.status(STATUS.SUCCESS.OK).send({ message: "Changes saved successfully!" })
        } else {

            await User.updateOne({ email: userEmail }, {
                name,
                gender
            });
        }

        return res.status(STATUS.SUCCESS.OK).send({ message: "Changes saved successfully!" })

    } catch (error) {

        console.log("Error edituserInfo", error);
    }
}

const generateOtpForPhone = async (req, res) => {

    const email = req.email;
    const { phone } = req.body;

    await Otp.deleteOne({ email });

    const otp_generated = createNewOtp();
    console.log("OTP: ", otp_generated);

    await Otp.create({
        email,
        code: otp_generated
    });

    return res.send({ success: true });
}

const verifyPhone = async (req, res) => {

    try {

        const email = req.email;
        const { phone, otp } = req.body;

        let doc = await Otp.findOne({ email });

        if (doc?.code == otp) {

            await User.updateOne({ email }, { phone: phone });
            await Otp.deleteOne({ email });

            return res.status(STATUS.SUCCESS.OK).send({ success: true });
        } else {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false });
        }
    } catch (error) {

        console.log("Error in VerifyPhone", error);
    }
}

const updateEmail = async (req, res) => {

    const oldEmail = req.email;
    const { email, otp } = req.body;
    console.log(email);

    const doc = await Otp.findOne({ email });

    if (doc?.code == otp) {

        await User.updateOne({ email: oldEmail }, { email: email });
        await Otp.deleteOne({ email });

        return res.status(STATUS.SUCCESS.OK).send({ success: true });
    }

    return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false });
};

const changePassword = async (req, res) => {

    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const email = req.email;

        if (newPassword != confirmPassword) {
            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Password not match" });
        }

        const userDoc = await User.findOne({ email });

        let match = await compare(newPassword, userDoc.password);

        if (match) {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Please provide a new Password!" });
        }

        match = await compare(currentPassword, userDoc.password);

        if (!match) {

            return res.status(STATUS.ERROR.BAD_REQUEST).send({ success: false, message: "Current password is wrong please recheck!" });
        }

        const saltRound = 5;
        const hashed_pass = await hash(newPassword, saltRound);

        await User.updateOne({ email }, { password: hashed_pass });

        return res.status(STATUS.SUCCESS.OK).send({ success: true, message: "Password Change Successfully" });

    } catch (error) {

        console.log("Error in change password!", error);
    }
}


export {
    register, verifyEmail, verifyUser, userLogin, generateOtpForEmail, resetPassword, googleAuth, fetchUserInfo, editUserInfo, generateOtpForPhone,
    verifyPhone, updateEmail, changePassword
}