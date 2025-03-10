import express from "express";
import { allUsers, checkAuth, forgotPassword, login, logout, resetPassword, signup, updateMembers, updateProfile, updateUsers, verifyEmail } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(isAuthenticated, resetPassword);
router.route("/profile/update").put(isAuthenticated, updateProfile);
router.route("/all-users").get(isAuthenticated, allUsers);
router.route("/update-users").put(isAuthenticated, updateUsers);
router.route("/update-members").put(isAuthenticated, updateMembers);

export default router;