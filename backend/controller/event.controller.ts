import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/uploadImage";
import { Event } from "../models/event.model";
import { Club } from "../models/club.model";
import mongoose, { ObjectId } from "mongoose";

export const addEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, mode, registrationFee, registrationEndDate, eventStartDate, eventEndDate, startTime, endTime, formLink } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({
                success: false,
                message: "Event Image is required."
            });
            return;
        };

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        const club = await Club.findOne({ user: req.id });
        if (!club) {
            res.status(404).json({
                success: false,
                message: "Club not found for this user."
            });
            return;
        }

        const event = await Event.create({
            name,
            description,
            mode,
            registrationFee,
            registrationEndDate,
            eventStartDate,
            eventEndDate,
            startTime,
            endTime,
            formLink,
            image: imageUrl,
            clubId: club._id,
            clubName: club.clubName,
        });

        club.events.push(event._id as any);
        await club.save();

        res.status(201).json({
            success: true,
            message: "Event Added Successfully.",
            event
        });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const editEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log(req.body);
        // console.log(req.files);

        const { id } = req.params;
        const { clubId, name, description, mode, registrationFee, registrationEndDate, eventStartDate, eventEndDate, startTime, endTime, formLink } = req.body;
        const file = req.file;

        // Check if `req.files` contains multiple images as an array or as an object with `images` field
        let files: Express.Multer.File[] = [];
        if (Array.isArray(req.files)) {
            files = req.files;
        } else if (req.files && 'images' in req.files) {
            files = req.files['images'] as Express.Multer.File[];
        }

        // Find the event by ID
        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found!!!"
            });
            return;
        }

        // Update fields if they exist in the request body
        if (clubId) event.clubId = clubId;
        if (name) event.name = name;
        if (description) event.description = description;
        if (mode) event.mode = mode;
        if (registrationFee) event.registrationFee = registrationFee;
        if (registrationEndDate) event.registrationEndDate = registrationEndDate;
        if (eventStartDate) event.eventStartDate = eventStartDate;
        if (eventEndDate) event.eventEndDate = eventEndDate;
        if (startTime) event.startTime = startTime;
        if (endTime) event.endTime = endTime;
        if (formLink) event.formLink = formLink;

        // Single image upload
        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            event.image = imageUrl;
        }

        // Multiple images upload
        if (files.length > 0) {
            const imageUrls = await Promise.all(files.map(async (imageFile) => {
                return await uploadImageOnCloudinary(imageFile);
            }));
            event.images = imageUrls;  // Save array of URLs in the 'images' field
        }

        // Save updated event
        await event.save();

        res.status(200).json({
            success: true,
            message: "Event Updated Successfully.",
            event,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.id;


        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found!!!"
            });
            return;
        }

        // Remove the event from the associated club's events
        const club = await Club.findById(userId);
        if (club) {
            club.events = (club.events as mongoose.Schema.Types.ObjectId[])
                .filter((eventId) => eventId.toString() !== id) as mongoose.Schema.Types.ObjectId[];
            await club.save();
        }

        // Delete the event
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const fetchAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log("Fetching all events");
        const event = await Event.find();
        // console.log("Events retrieved from database:", event);

        if (!event) {
            res.status(404).json({
                success: false,
                event: [],
                message: "No Events found."
            });
            return;
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: error || "Internal Server Error." });
    }
};