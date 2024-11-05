import express from "express"
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addEvent, editEvent } from "../controller/event.controller";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addEvent);
router.route("/:id").put(isAuthenticated, upload.single("image"), editEvent);

export default router;