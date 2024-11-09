import mongoose, { Document } from "mongoose";

export interface IEvent {
    name: string;
    description: string;
    mode: "Online" | "Offline";
    registrationFee: number;
    registrationEndDate: Date;
    eventStartDate: Date;
    eventEndDate: Date;
    startTime: string;
    endTime: string;
    image?: string;
    formLink: string;
    images?: string[];
    clubId: mongoose.Schema.Types.ObjectId;
    clubName: string;
}

export interface IEventDocument extends IEvent, Document {
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEventDocument>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true,
    },
    registrationFee: {
        type: Number,
        required: true,
        min: 0,
    },
    registrationEndDate: {
        type: Date,
        required: true,
    },
    eventStartDate: {
        type: Date,
        required: true,
    },
    eventEndDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    formLink: {
        type: String,
        required: true,
    },
    images: [{ type: String }],
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true,
    },
    clubName: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);