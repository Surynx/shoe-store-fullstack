import transporter from "../config/nodemailer.js"

const sendEmail= async(email,otp)=> {

    const mailFormat= {
        from: process.env.EMAIL_USER,
        to:email,
        subject: "Your OTP Verification Code",
        html: `
            <h2>Your OTP Code</h2>
            <p>Your verification OTP is: <b>${otp}</b></p>
            <p>Valid for 5 minutes.</p>
        `,
    }

    await transporter.sendMail(mailFormat);
}

export default sendEmail;