import nodemailer from "nodemailer";
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "../mailtrap/htmlEmail";

export const sendEmail = async (options:any) => {
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
export const sendWelcomeEmaill = async (options:any) => {
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
        html: generateWelcomeEmailHtml(options.name),
    };

    await transporter.sendMail(mailOptions);
};
export const sendResetSuccessEmail = async (options:any) => {
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
        html: generateResetSuccessEmailHtml(),
    };

    await transporter.sendMail(mailOptions);
};
export const sendPasswordResetEmail = async (options:any) => {
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
        html: generatePasswordResetEmailHtml(options.resetURL),
    };

    await transporter.sendMail(mailOptions);
};