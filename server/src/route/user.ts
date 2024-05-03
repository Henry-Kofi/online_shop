import { Router } from "express";
import { login, register, verifyUser } from "../controller/user";

const authRoute  = Router()

authRoute.post("/register",register);
authRoute.put("/verify",verifyUser);
authRoute.post("/login",login);


export default authRoute