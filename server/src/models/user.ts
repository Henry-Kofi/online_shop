import mongoose,{Schema,model,Document} from "mongoose";

export interface User extends Document{
    email: string;
    phone: string;
    password: string;
    name: string;
    role: string;
    isVerified: boolean;
}

const userSchema: Schema = new Schema<User>({
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    role:{
        type: String,
        enum:["user","vendor","rider"],
        default: "user"
    },
    isVerified:{
        type: Boolean,
        default: false
    }
},{timestamps: true});

const userModel = model<User>("users",userSchema);

export default userModel;