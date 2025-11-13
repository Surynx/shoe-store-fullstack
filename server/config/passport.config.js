import passport from "passport";
import { Strategy as GoogleStrategy }  from "passport-google-oauth20";
import User from "../models/user.models.js";
import { configDotenv } from "dotenv";

configDotenv();

passport.use(
    new GoogleStrategy({
        clientID:process.env.Google_Client_ID,
        clientSecret:process.env.Google_Client_Secret,
        callbackURL:"http://localhost:8080/user/auth/google/callback"
    },
    async (accessToken,refreshToken,profile,done) =>{
        try {

            let user = await User.findOne({ email:profile.emails[0].value });

            if(!user) {
                
                user = await User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    profile_picture:profile.photos[0].value,
                    isVerified:true
                });

                await user.save();

            }else {
                
                await User.updateOne({email:user.email},{
                    profile_picture:profile.photos[0].value,
                    isVerified:true
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