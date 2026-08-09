import dbConnect from "@/lib/dbconnection";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema"

export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username, code} = await request.json();

        const decodeUserName = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodeUserName})

        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            },{status: 502})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successfully"
            },{status: 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired"
            },{status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Invalid verification code"
            },{status: 402})
        }
    }
    catch(error){
        console.log("Error in verify-code route:", error);
        return Response.json({
            success:false,
            message: "An error occurred while processing the request"
        },{status: 500})
    }
}