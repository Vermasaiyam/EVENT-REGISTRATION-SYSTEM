
import { Request, Response } from "express";
import { Club } from "../models/club.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/uploadImage";

export const createClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clubName, eventTypes, coreTeam } = req.body;
        const file = req.file;

        // console.log("Request body:", req.body);
        // console.log("Event Types:", eventTypes);
        // console.log("Core Team:", coreTeam);

        const club = await Club.findOne({ user: req.id });

        if (club) {
            res.status(400).json({
                success: false,
                message: "Club already exists for this user."
            })
            return;
        }
        if (!file) {
            res.status(400).json({
                success: false,
                message: "Image is required."
            })
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

        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Club.create({
            user: req.id,
            clubName,
            eventTypes: JSON.parse(eventTypes),
            coreTeam: JSON.parse(coreTeam),
            imageUrl
        });
        res.status(201).json({
            success: true,
            message: "Club Added Successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." })
    }
}

export const getClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const club = await Club.findOne({ user: req.id }).populate('events');
        if (!club) {
            res.status(404).json({
                success: false,
                club: [],
                message: "Club not found."
            })
            return;
        };
        res.status(200).json({
            success: true,
            club
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error." })
    }
}

export const updateClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clubName, eventTypes, coreTeam } = req.body;
        const file = req.file;
        const club = await Club.findOne({ user: req.id });
        if (!club) {
            res.status(404).json({
                success: false,
                message: "Club not found"
            })
            return;
        };
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

// export const getClubOrder = async (req: Request, res: Response) => {
//     try {
//         const club = await Club.findOne({ user: req.id });
//         if (!club) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Club not found."
//             })
//         };
//         const orders = await Order.find({ club: club._id }).populate('club').populate('user');
//         return res.status(200).json({
//             success: true,
//             orders
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal Server Error." })
//     }
// }

// export const updateOrderStatus = async (req: Request, res: Response) => {
//     try {
//         const { orderId } = req.params;
//         const { status } = req.body;
//         const order = await Club.findById(orderId);
//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found."
//             })
//         }
//         order.status = status;
//         await order.save();
//         return res.status(200).json({
//             success: true,
//             status: order.status,
//             message: "Status Updated."
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal Server Error." })
//     }
// }

export const searchClub = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedEvents = (req.query.selectedEvents as string || "").split(",").filter(event => event);
        const query: any = {};
        // basic search based on searchText (name ,city, country)
        console.log(selectedEvents);

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
        console.log(query);

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
export const fetchAllClubs = async (_: Request, res: Response): Promise<void> => {
    try {
        console.log("Fetching all clubs");
        const club = await Club.find();
        console.log("Clubs retrieved from database:", club);

        if (!club || club.length === 0) {
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
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error." });
    }
};