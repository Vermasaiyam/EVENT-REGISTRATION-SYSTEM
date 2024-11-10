import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendEmail, sendResetSuccessEmail, sendWelcomeEmaill, sendPasswordResetEmail } from "../utils/sendEmail";
import { Club } from "../models/club.model";

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
        // await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        const forgotPasswordToken = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        // nodemailer implementation
        const message = `ABES-EventHub : Forgot Password`;
        // console.log(message);
        await sendPasswordResetEmail({
            email: user.email,
            subject: `ABES-EventHub : Forgot Password`,
            message,
            name: forgotPasswordToken,
        })

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
        // console.log(req.id);
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
        const message = `Password Reset Successfull`;
        // console.log(message);
        await sendResetSuccessEmail({
            email: user.email,
            subject: `Password Reset Successfull`,
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
        const userId = req.id;
        const { fullname, email, addmission_no, branch, current_year, profilePicture } = req.body;

        const updatedData: any = { fullname, email, addmission_no, branch, current_year };

        if (profilePicture) {
            const cloudResponse = await cloudinary.uploader.upload(profilePicture);
            updatedData.profilePicture = cloudResponse.secure_url;
        }

        // Update the user profile
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
};

export const allUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log(req.id);

        const allUsers = await User.find().select("-password");

        res.status(200).json({
            success: true,
            allUsers,
            message: "All Users Fetched Successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log(req.id);
        const { userId, email, fullname, isAdmin, isClubCounselor, counselorsClub } = req.body;

        const payload = {
            ...(email && { email: email }),
            ...(fullname && { fullname: fullname }),
            ...({ admin: isAdmin }),
            ...({ clubCounselor: isClubCounselor }),
            ...(counselorsClub ? { counselorClubName: counselorsClub } : { counselorClubName: "" }),
        };

        if (isClubCounselor && counselorsClub) {
            const club = await Club.findOneAndUpdate(
                { clubName: counselorsClub },
                { $addToSet: { user: userId } },
                { new: true }
            );

            if (!club) {
                res.status(404).json({ success: false, message: "Club not found" });
                return;
            }
        } else if (!isClubCounselor && counselorsClub) {
            const club = await Club.findOneAndUpdate(
                { clubName: counselorsClub },
                { $pull: { user: userId } },
                { new: true }
            );

            if (!club) {
                res.status(404).json({ success: false, message: "Club not found" });
                return;
            }
        }

        const updateUser = await User.findByIdAndUpdate(userId, payload, { new: true }).select("-password");

        if (!updateUser) {
            res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            updateUser,
            message: "User Updated Successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, email, fullname, isMember, membersClubName, clubName } = req.body;

        // Prepare the payload for the user update
        const payload = {
            ...(email && { email }),
            ...(fullname && { fullname }),
            clubMember: isMember,
            membersClubName: membersClubName || ""
        };

        // Update the user
        const updateUser = await User.findByIdAndUpdate(userId, payload, { new: true }).select("-password");

        if (!updateUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        // If isMember is true, add userId to the club's user array
        if (isMember && clubName) {
            const club = await Club.findOneAndUpdate(
                { clubName: clubName },
                { $addToSet: { user: userId } }, // Add userId only if it’s not already in the array
                { new: true }
            );

            if (!club) {
                res.status(404).json({ success: false, message: "Club not found" });
                return;
            }
        } else if (!isMember && clubName) {
            // If isMember is false, remove userId from the club's user array
            const club = await Club.findOneAndUpdate(
                { clubName: clubName },
                { $pull: { user: userId } }, // Remove userId from the array
                { new: true }
            );

            if (!club) {
                res.status(404).json({ success: false, message: "Club not found" });
                return;
            }
        }

        res.status(200).json({
            success: true,
            updateUser,
            message: "User Updated Successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};