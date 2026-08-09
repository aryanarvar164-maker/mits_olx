// functiionality => get all messages

import dbConnect from "@/lib/dbconnection";
import {getServerSession} from "next-auth";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request : Request){
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

    // in options we add user id as an string so almost all time find user id was handle correctly
    // but in aggregation pipline this can be issue
    // const userId = user._id    so we dont use like this

    // we add as an mongoose object 
    const userId = new mongoose.Types.ObjectId(user._id)
    try{
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
        if(!user || user.length === 0){
            return Response.json(
            {
                success: false,
                message: 'user was not found',
            },
            { status: 404 }
        );
        }
        return Response.json(
            {
                success: true,
                // aggregate return in user 
                messages: user[0].messages
            },
            { status: 200 }
        );
    }catch(error){
        console.log(error);
        return Response.json(
            {
                success: false,
                message: 'Error fetching messages api response section',
            },
            { status: 500 }
        )
    }
}