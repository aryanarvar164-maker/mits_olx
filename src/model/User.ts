import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}
export interface Post extends Document{
    title: string;
    description: string;
    files: string[];
    createdAt: Date;
    price: number;
    category: string;
}

const messageSchema = new Schema<Message>({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date, 
        required:true,
        default: Date.now
    }
})
const postSchema = new Schema<Post>({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    files:{
        type: [String],
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date, 
        required:true,
        default: Date.now
    },
    category:{
        type: String,
        required: true
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
    post: Post[];
}

const userSchema = new Schema<User>({
    username:{
        type: String,
        required:[true, "Username is required"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique: true,
        trim: true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please enter a valid email"]
    },
    password:{
        type: String,
        required:[true, "password is required"],
    },
    verifyCode:{
         type: String,
        required:[true, "verify Code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true, "verify Code Expiry is required"],
    },
    isVerified:{
        type: Boolean,
        required:[true, "user not verified"],
    },
    isAcceptingMessages:{
        type: Boolean,
        required:[true, "message was not accepting"],
    },
    messages: [messageSchema] ,
    post : [postSchema]
    
})
                    // if you have pre defined model || if you create new model

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema))

export default UserModel;