import { z } from "zod";

export const userSignupSchema = z.object({
    fullname: z.string().min(1, "Fullname is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be of at least 8 characters."),
    contact: z.string().min(10, { message: "Invalid contact number." }).max(10, "Invalid contact number."),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be of at least 8 characters.")
});

export type LoginInputState = z.infer<typeof userLoginSchema>;

export const userResetPasswordSchema = z.object({
    oldPassword: z.string().min(8, "Old Password must be of at least 8 characters."),
    newPassword: z.string().min(8, "New Password must be of at least 8 characters."),
});

export type ResetPasswordInputState = z.infer<typeof userResetPasswordSchema>;