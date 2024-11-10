import express from "express"
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addEvent, deleteEvent, editEvent } from "../controller/event.controller";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single('image'), addEvent);

router.route("/:id").put(
    isAuthenticated,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ]) as express.RequestHandler,
    editEvent
);

router.route("/delete/:id").delete(isAuthenticated, deleteEvent);

export default router;