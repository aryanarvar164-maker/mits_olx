import dbConnect from "@/lib/dbconnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel, { Post } from "@/model/User";

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

// export async function POST(request: Request) {
//     await dbConnect();

//     const session = await getServerSession(authOptions);

//     if (!session?.user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "Not Authenticated",
//             },
//             { status: 401 }
//         );
//     }

//     const user = await UserModel.findById(session.user._id);

//     if (!user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "User not found",
//             },
//             { status: 404 }
//         );
//     }

//     const { title, description, files, price, category } =
//         await request.json();

//         try {
//             user.post.push({
//                 title,
//                 price,
//                 description,
//                 files,
//                 category,
//                 createdAt: new Date(),
//             });
//         } catch (error) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "Failed to upload post in api",
//                 },
//                 { status: 500 }
//             );
//         }

//     await user.save();

//     return Response.json(
//         {
//             success: true,
//             message: "Post uploaded successfully",
//         },
//         { status: 201 }
//     );
// }

export async function POST(request: Request) {
try {
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

    console.log("SESSION USER ID:", session.user?._id);

    const userId = (session.user as { _id: string })._id;
    const user = await UserModel.findById(userId);

    console.log("USER FOUND:", user?._id);

    if (!user) {
        return Response.json(
            {
                success: false,
                message: "User not found",
            },
            { status: 404 }
        );
    }

    const body = await request.json();
    const {
        title,
        description,
        files,
        price,
        category,
    } = body;

    console.log("REQUEST DATA RECEIVED:", {
        title: title?.toString(),
        description: description?.toString(),
        files: Array.isArray(files) ? `Array of ${files.length}` : files,
        price: price?.toString(),
        category: category?.toString(),
    });

    // Validate required fields
    if (!title || !description || !files || price === undefined || price === null || !category) {
        console.log("VALIDATION FAILED", {
            title: Boolean(title),
            description: Boolean(description),
            files: Boolean(files),
            price: Boolean(price !== undefined && price !== null),
            category: Boolean(category),
        });
        return Response.json(
            {
                success: false,
                message: "Missing required fields",
            },
            { status: 400 }
        );
    }

    const postData = {
        title: String(title).trim(),
        description: String(description).trim(),
        files: Array.isArray(files) ? files.map(f => String(f)) : [String(files)],
        price: parseFloat(price),
        category: String(category).trim(),
        createdAt: new Date(),
    };

    console.log("POST DATA TO SAVE:", JSON.stringify(postData));

    // Use $push operator with MongoDB to ensure proper validation
    const result = await UserModel.updateOne(
        { _id: userId },
        { $push: { post: postData } }
    );

    console.log("UPDATE RESULT:", result);

    console.log("POST SAVED SUCCESSFULLY");

    return Response.json(
        {
            success: true,
            message: "Post uploaded successfully",
        },
        { status: 201 }
    );

} catch (error) {
    console.error("UPLOAD CONTENT ERROR:", error);

    return Response.json(
        {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unknown server error",
        },
        { status: 500 }
    );
}

}
