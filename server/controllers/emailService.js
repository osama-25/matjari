import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },


});
//HERE

export const sendResetEmail = async (email, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="text-align: center; color: #2497eb;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #333;">Hi,</p>
            <p style="font-size: 16px; color: #333;">
                You requested a password reset. Click the link below to reset your password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #2497eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Reset Password
                </a>
            </div>
            <p style="font-size: 14px; color: #999;">
                This link expires in 15 minutes.
            </p>
            <hr style="border: 0; border-top: 1px solid #ddd;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
                If you didn't request a password reset, you can ignore this email.
            </p>
        </div>
               `
    };
    // console.log("FAFDSF");


    await transporter.sendMail(mailOptions);
};
