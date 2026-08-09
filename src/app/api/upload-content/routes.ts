import dbConnect from "@/lib/dbconnection";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


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
}