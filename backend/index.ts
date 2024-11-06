import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/connectDB";
import userRoute from "./routes/user.route";
import clubRoute from "./routes/club.route";
import eventRoute from "./routes/event.route";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { fetchAllClubs } from "./controller/club.controller";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions));


app.use("/api/user", userRoute);
app.use("/api/club", clubRoute);
app.use("/api/event", eventRoute);


app.get("/api/clubs",isAuthenticated,fetchAllClubs);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at port ${PORT}`);
});