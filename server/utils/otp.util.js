import otpGenerator from "otp-generator"

const createNewOtp = ()=> {

    const otp_generated = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });
    return otp_generated;
} 

export default createNewOtp;