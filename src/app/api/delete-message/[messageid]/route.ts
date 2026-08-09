// functiionality => get all messages

import dbConnect from "@/lib/dbconnection";
import {getServerSession} from "next-auth";
import UserModel from "@/model/User";
import {User} from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function DELETE(request : Request, {params} : {params : {messageid : string} }){
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
     try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
}

}