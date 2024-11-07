import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY! as string) as jwt.JwtPayload;

        if (!decode) {
            res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
            return;
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ success: false, message: "Invalid token signature" });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ success: false, message: "Token has expired" });
        } else {
            console.error("Unexpected error in isAuthenticated middleware:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};
