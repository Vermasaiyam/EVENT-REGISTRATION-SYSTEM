
import { Request, Response } from "express";
import { Club } from "../models/club.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/uploadImage";
import { User } from "../models/user.model";

export const createClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clubName, eventTypes, coreTeam } = req.body;
        const file = req.file;

        const club = await Club.findOne({ user: { $in: [req.id] } });

        // Check if the user already has a club
        if (club) {
            res.status(400).json({
                success: false,
                message: "Club already exists for this user."
            });
            return;
        }

        // Check if the club with the same name already exists
        const userWithSameClubName = await Club.findOne({ clubName: clubName });
        if (userWithSameClubName) {
            res.status(400).json({
                success: false,
                message: "Club with this name already exists."
            });
            return;
        }

        // Check if an image is provided
        if (!file) {
            res.status(400).json({
                success: false,
                message: "Image is required."
            });
            return;
        }

        // Parse eventTypes and coreTeam with error handling
        let parsedEventTypes;
        let parsedCoreTeam;

        try {
            parsedEventTypes = eventTypes ? JSON.parse(eventTypes) : [];
            parsedCoreTeam = coreTeam ? JSON.parse(coreTeam) : [];
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            res.status(400).json({
                success: false,
                message: "Invalid JSON format for eventTypes or coreTeam."
            });
            return;
        }

        // Upload the image to Cloudinary
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        // Create the club
        const newClub = await Club.create({
            user: [req.id],
            clubName,
            eventTypes: parsedEventTypes,
            coreTeam: parsedCoreTeam,
            imageUrl
        });

        // Update the user's details
        const user = await User.findById(req.id);
        if (user) {
            user.clubMember = true;
            user.membersClubName = clubName;
            await user.save();
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: "Club Added Successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


export const getClub = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ensure req.id contains the user ID
        const userId = req.id;

        // Find the club where user array contains userId
        const club = await Club.findOne({ user: { $in: [userId] } }).populate('events');

        if (!club) {
            res.status(404).json({
                success: false,
                club: null,
                message: "Club not found."
            });
            return;
        }

        res.status(200).json({
            success: true,
            club
        });
    } catch (error) {
        console.error("Error in getClub:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const updateClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clubName, eventTypes, coreTeam } = req.body;
        const file = req.file;
        const club = await Club.findOne({ user: { $in: [req.id] } });
        if (!club) {
            res.status(404).json({
                success: false,
                message: "Club not found"
            })
            return;
        };

        const existingClub = await Club.findOne({ clubName, _id: { $ne: club._id } });
        if (existingClub) {
            res.status(400).json({
                success: false,
                message: "Club with this name already exists. Please choose a different name.",
            });
            return;
        }

        club.clubName = clubName;
        club.eventTypes = JSON.parse(eventTypes);
        club.coreTeam = JSON.parse(coreTeam);

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            club.imageUrl = imageUrl;
        }
        await club.save();
        res.status(200).json({
            success: true,
            message: "Club Updated.",
            club
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." })
    }
}

export const searchClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedEvents = (req.query.selectedEvents as string || "").split(",").filter(event => event);
        const query: any = {};

        // console.log(selectedEvents);

        if (searchText) {
            query.$or = [
                { clubName: { $regex: searchText, $options: 'i' } },
                { eventTypes: { $regex: searchText, $options: 'i' } },
                { coreTeam: { $regex: searchText, $options: 'i' } },
            ]
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { clubName: { $regex: searchQuery, $options: 'i' } },
                { eventTypes: { $regex: searchQuery, $options: 'i' } },
                { coreTeam: { $regex: searchQuery, $options: 'i' } },
            ]
        }
        // console.log(query);

        if (selectedEvents.length > 0) {
            query.events = { $in: selectedEvents }
        }

        const clubs = await Club.find(query);
        res.status(200).json({
            success: true,
            data: clubs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." })
    }
}

export const getSingleClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const clubId = req.params.id;
        const club = await Club.findById(clubId).populate({
            path: 'events',
            options: { createdAt: -1 }
        });
        if (!club) {
            res.status(404).json({
                success: false,
                message: "Club not found."
            })
            return;
        };
        res.status(200).json({ success: true, club });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." })
    }
}
export const fetchAllClubs = async (req: Request, res: Response): Promise<void> => {
    try {
        // console.log("Fetching all clubs");
        const club = await Club.find().populate({
            path: 'events',
            options: { createdAt: -1 }
        });
        // console.log("Clubs retrieved from database:", club);

        if (!club) {
            res.status(404).json({
                success: false,
                club: [],
                message: "No clubs found."
            });
            return;
        }

        res.status(200).json({
            success: true,
            club
        });
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ message: error || "Internal Server Error." });
    }
};