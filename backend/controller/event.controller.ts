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

        // Find the club associated with the user
        const club = await Club.findOne({ user: req.id });
        if (!club) {
            res.status(404).json({
                success: false,
                message: "Club not found for this user."
            });
            return;
        }

        // Create the event with the clubId
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
            clubId: club._id // Associate the event with the clubId
        });

        // Add the event to the club's events list
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
        const { id } = req.params;
        const { name, description, mode, registrationFee, registrationEndDate, eventStartDate, eventEndDate, startTime, endTime, formLink } = req.body;
        const file = req.file;
        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found!!!"
            });
            return;
        }
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

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            event.image = imageUrl;
        }
        await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated",
            event,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

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