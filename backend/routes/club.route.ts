import express from "express"
import { createClub, fetchAllClubs, getClub, getSingleClub, searchClub, updateClub } from "../controller/club.controller";
import upload from "../middlewares/multer";
import {isAuthenticated} from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createClub);
router.route("/").get(isAuthenticated, getClub);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateClub);
router.route("/search/:searchText").get(isAuthenticated, searchClub);
router.route("/:id").get(isAuthenticated, getSingleClub);
// router.route("/clubs").get(isAuthenticated, fetchAllClubs);

export default router;