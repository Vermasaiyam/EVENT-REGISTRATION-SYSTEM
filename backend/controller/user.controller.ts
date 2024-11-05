import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail } from "../mailtrap/email";
import { sendEmail, sendResetSuccessEmail, sendWelcomeEmaill } from "../utils/sendEmail";

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({
                success: false,
                message: "User Already Exists."
            })
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })
        generateToken(res, user);

        // await sendVerificationEmail(email, verificationToken);
        const message = `your verification code is :-\n${verificationToken} `;
        // console.log(message);
        await sendEmail({
            email: user.email,
            subject: `ABES - EventHub verification code.`,
            message,
            verificationToken,
        })

        const userWithoutPassword = await User.findOne({ email }).select("-password");
        res.status(201).json({
            success: true,
            message: "Account Created Successfully.",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist.",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect Email or Password.",
            });
            return;
        }

        generateToken(res, user);

        user.lastLogin = new Date();
        await user.save();

        const userWithoutPassword = await User.findOne({ email }).select("-password");

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { verificationCode } = req.body;

        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid Verification Token."
            });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();

        // send welcome email
        // await sendWelcomeEmail(user.email, user.fullname);

        // nodemailer implementation
        const message = `Welcome to ABES-EventHub`;
        // console.log(message);
        await sendWelcomeEmaill({
            email: user.email,
            subject: `Welcome to ABES - EventHub`,
            message,
            name: user.fullname,
        })

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully.",
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (_: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged Out Successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
            return;
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.id);
        const userId = req.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist.",
            });
            return;
        }
        const { oldPassword, newPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect Password.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        // send success reset email
        const message = `Password Reset Successful`;
        // console.log(message);
        await sendResetSuccessEmail({
            email: user.email,
            subject: `Password Reset Successful`,
            message,
        })

        res.status(200).json({
            success: true,
            message: "Password Reset Successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        };
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.id);

        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;

        //cloudinary
        let cloudResponse: any;
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData = { fullname, email, address, city, country, profilePicture };

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        res.status(200).json({
            success: true,
            user,
            message: "Profile Updated Successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}