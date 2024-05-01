import jwt,{Jwt,Secret,JwtPayload} from "jsonwebtoken"
import { User } from "../models/user"


const JWT = {
    secret: String(process.env.TOKEN),
    exp:"100d"
}

// user: {
    // id: '663299139162351226e56961',        
    // role: 'user',
    // isVerified: false,
    // iat: 1714592019,
    // exp: 1723232019

interface DecodedUser{
    id: string;
    role: string;
    isVerified: boolean;
    iat: number;
    exp: number
}
export interface Token {
    isValid: boolean;
    user?: string | JwtPayload
}
const generateToken = (user: User) => {
    return jwt.sign({id: user._id,role:user.role,isVerified: user.isVerified},JWT.secret,{
        expiresIn: JWT.exp
    })
}

const verifyToken = async (token: string): Promise<Token> => {
    try {
        const payload = await jwt.verify(token,JWT.secret)
        return {isValid: true, user: payload}
    } catch (error) {
        return {isValid: false}
    }
} 

export {generateToken,verifyToken};