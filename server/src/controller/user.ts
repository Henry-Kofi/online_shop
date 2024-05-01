import userModel, { User } from "../models/user";
import { Response, Request } from "express";
import bcryptjs from "bcryptjs"
import { generateToken, verifyToken } from "../commons/token";
import scheduler from "./utils/scheduler"
import { JwtPayload } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const {email,phone,password, name,role}:User = req.body;
    try {
        // search if user exist
        const existingUser: User | null = await userModel.findOne({
            email: email
        })
        if(existingUser){ // user exists
            return res.status(400).json({
                success: true,
                message: "Email already in use"
            })
        }

        const hashedPassword = await bcryptjs.hash(password, 12); // encrypt password
        
        const newUser:User = await userModel.create({
            email,
            phone,
            password:hashedPassword,
            name,
            role
        })
        const token = await generateToken(newUser);
        res.cookie("token",token)
        // scheduler event
        scheduler.scheduleEvent(newUser)
        return res.status(200).json({
            success: true,
            message: "Success creating user accout✔",
            data: newUser
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "internal server error🚨"
        })
    }
}

export const verifyUser = async (req: Request,res: Response) => {
    const {otpCode} = req.body;
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access❌"
            })
        }
        const decodedToken = await verifyToken(token) as JwtPayload
        if(!decodedToken.isValid){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access❌"
            })
        }
        const existingUser: User | null = await userModel.findById(decodedToken.user?.id);
        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "User does not exist😛"
            })
        }
        const response =await scheduler.updateUser(decodedToken.user,otpCode)
        return res.status(response.code).json({
            success: response.success,
            message: response.message
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error🚨"
        })
    }
}