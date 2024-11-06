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
            })
            return;
        };
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const event: any = await Event.create({
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
        });
        const club = await Club.findOne({ user: req.id });
        if (club) {
            (club.events as mongoose.Schema.Types.ObjectId[]).push(event._id);
            await club.save();
        }

        res.status(201).json({
            success: true,
            message: "Event Added Successfully.",
            event
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

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