import passport from "passport";
import { Strategy as GoogleStrategy }  from "passport-google-oauth20";
import User from "../models/user.model.js";
import { configDotenv } from "dotenv";
import generateReferralCode from "../utils/referral.util.js";

configDotenv();

passport.use(
    new GoogleStrategy({
        clientID:process.env.Google_Client_ID,
        clientSecret:process.env.Google_Client_Secret,
        callbackURL:`${process.env.Server_Localhost}/user/auth/google/callback`
    },
    async (accessToken,refreshToken,profile,done) =>{
        try {

            let user = await User.findOne({ email:profile.emails[0].value });

            if(!user) {

                const referral_code= generateReferralCode();
                
                user = await User.create({
                    google_id:profile.id,
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    profile_picture:profile.photos[0].value,
                    isVerified:true,
                    referral_code
                });

                await user.save();

            }else { 
                await User.updateOne({email:user.email},{
                    name:profile.displayName,
                    isVerified:true,
                    google_id:profile.id
                });
            }

            return done(null,user);
            
        } catch (error) {

            console.log("Error in google auth");
            return done(error,null);
            
        }
    }
    )
);

export default passport