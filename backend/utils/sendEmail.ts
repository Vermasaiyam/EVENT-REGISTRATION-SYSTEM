import nodemailer from "nodemailer";
import { htmlContent } from "../mailtrap/htmlEmail";

const sendEmail = async (options:any) => {
    let config = {
        service: "gmail",
        auth: {
            user: "vermasaiyam9@gmail.com",
            pass: "qnfiecvpzgtfjcif",
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: "vermasaiyam9@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: htmlContent.replace("{verificationToken}", options.verificationToken),
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;