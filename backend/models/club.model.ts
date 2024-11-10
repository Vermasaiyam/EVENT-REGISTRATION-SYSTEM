import mongoose, { Document } from "mongoose";

export interface IClub {
    user: mongoose.Schema.Types.ObjectId[];
    clubName: string;
    eventTypes: string[];
    coreTeam: string[];
    imageUrl: string;
    events: mongoose.Schema.Types.ObjectId[]
}
export interface IClubDocument extends IClub, Document {
    createdAt: Date;
    updatedAt: Date;
}

const clubSchema = new mongoose.Schema<IClubDocument>({
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    clubName: {
        type: String,
        required: true
    },
    eventTypes: [{ type: String, required: true }],
    coreTeam: [{ type: String, required: true }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });
export const Club = mongoose.model("Club", clubSchema);