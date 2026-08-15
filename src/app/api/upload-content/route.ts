import dbConnect from "@/lib/dbconnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    return Response.json(
        {
            success: true,
            message: "authenticated",
        },
        { status: 200 }
    );
}

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const user = await UserModel.findById(session.user._id);

    if (!user) {
        return Response.json(
            {
                success: false,
                message: "User not found",
            },
            { status: 404 }
        );
    }

    const { title, description, files, price } =
        await request.json();

        user.post.push({
        title,
        price,
        description,
        files,
        createdAt: new Date(),
    });

    await user.save();

    return Response.json(
        {
            success: true,
            message: "Post uploaded successfully",
        },
        { status: 201 }
    );
}