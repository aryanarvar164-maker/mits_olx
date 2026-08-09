import dbConnect from "@/lib/dbconnection";
import {getServerSession} from "next-auth";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request :  Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    
    // declare type of user to be User from next-auth
    const user:User = session?.user

    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }
    const userId = user._id
    const { acceptingMessages } = await request.json();
    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptingMessages },
            { new: true }
        );
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: 'updated user was not found',
                },
                { status: 401 }
            ); 
        }
        return Response.json(
                {
                    success: true,
                    message: 'updated user was found and updated',
                    updatedUser,
                },
                { status: 200 }
            ); 
    }
    catch(error){
        console.log("error in accept-messages route:", error)
        return Response.json(
            {
                success: false,
                message: 'error in accept-messages route',
            },
            { status: 500 }
        );
    }
}

export async function GET(){
    await dbConnect();

    const session = await getServerSession(authOptions);
    
    // declare type of user to be User from next-auth
    const user:User = session?.user

    if(!session || !user){
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated',
            },
            { status: 401 }
        );
    }
    const userId = user._id
    try{
        const userFound = await UserModel.findById(userId)

        if(!userFound){
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'User status was found',
                //main response to check if user is accepting messages or not
                isAcceptingMessages: userFound.isAcceptingMessages
            },
            { status: 200 }
        );
    }
    catch(error){
        console.log("error in accept-messages get request status route:", error)
        return Response.json(
            {
                success: false,
                message: 'error in accept-messages status route',
            },
            { status: 500 }
        );
    }
}