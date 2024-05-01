import { Router } from "express";
import { register, verifyUser } from "../controller/user";

const authRoute  = Router()

authRoute.post("/register",register);
authRoute.put("/verify",verifyUser)


export default authRoute