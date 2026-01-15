import jwt from "jsonwebtoken"
import STATUS from "../constants/status.constant.js";
import User from "../models/user.model.js";

export const isUser = async (req, res, next) => {

    try {
        if (req?.headers?.authorization?.startsWith("Bearer")) {

            let token = req.headers.authorization.split(" ")[1];
            let decode = jwt.verify(token, process.env.JWT_KEY_USER);

            const userMail = decode.email
            req.email = userMail;

            const user = await User.findOne({ email: userMail });

            if (user.isBlock) {
                
                return res.status(STATUS.ERROR.FORBIDDEN).json({message: "User is blocked",blocked: true});
            }

            next();

        } else {
            return res.status(STATUS.ERROR.FORBIDDEN).send("UnAuthorized Access Denied")
        }
    } catch (error) {

        console.log(error);
    }

}