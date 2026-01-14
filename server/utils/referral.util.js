import crypto from "crypto"

const generateReferralCode= () => {
    
    return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export default generateReferralCode