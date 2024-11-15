import nodemailer from "nodemailer";
import { generateClubCreationEmailHtml, generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "../mailtrap/htmlEmail";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (options:any) => {
    let config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
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
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
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
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
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
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: generatePasswordResetEmailHtml(options.resetURL),
    };

    await transporter.sendMail(mailOptions);
};
export const sendClubCreationEmail = async (options:any) => {
    let config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    };

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: generateClubCreationEmailHtml(options.clubName, options.eventTypes, options.coreTeam, options.clubEmail, options.instaHandle, options.linkedinHandle, options.xHandle),
    };

    await transporter.sendMail(mailOptions);
};