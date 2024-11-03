import mongoose, { Document, Model } from "mongoose";

export interface IUser {
    fullname: string;
    email: string;
    password: string;
    contact: number;
    addmission_no: string;
    current_year: string;
    branch: string;
    profilePicture: string;
    admin: boolean;
    lastLogin?: Date;
    isVerified?: boolean;
    resetPasswordToken?: string;
    resetPasswordTokenExpiresAt?: Date;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date
}

export interface IUserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    addmission_no: {
        type: String,
        default: "Addmission Number"
    },
    current_year: {
        type: String,
        enum: ["1st","2nd","3rd","4th"]
    },
    branch: {
        type: String,
        default: "Branch"
    },
    profilePicture: {
        type: String,
        default: "",
    },
    admin: { type: Boolean, default: false },
    // advanced authentication
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);