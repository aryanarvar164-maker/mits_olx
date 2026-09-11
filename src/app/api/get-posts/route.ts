// // functionality => get all messages / posts by category

// import dbConnect from "@/lib/dbconnection";
// import { getServerSession } from "next-auth";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import mongoose, { PipelineStage } from "mongoose";

// export async function GET(request: Request) {
//     await dbConnect();

//     const session = await getServerSession(authOptions);

//     const user: User = session?.user;

//     if (!session || !user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "Not Authenticated",
//             },
//             { status: 401 }
//         );
//     }

//     const userId = new mongoose.Types.ObjectId(user._id);

//     // Get category from URL
//     // Example:
//     // /api/posts?category=technology
//     // /api/posts?category=all
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get("category");

//     try {
//         const pipeline: PipelineStage[] = [
//             // Find logged-in user
//             {
//                 $match: {
//                     _id: userId,
//                 },
//             },

//             // Convert post array into individual documents
//             {
//                 $unwind: "$post",
//             },
//         ];

//         // If category is provided and it is not "all",
//         // filter posts according to category
//         if (category && category !== "all") {
//             pipeline.push({
//                 $match: {
//                     "post.category": category,
//                 },
//             });
//         }

//         // Sort posts by newest first
//         pipeline.push(
//             {
//                 $sort: {
//                     "post.createdAt": -1,
//                 },
//             },

//             // Put posts back into an array
//             {
//                 $group: {
//                     _id: "$_id",
//                     post: {
//                         $push: "$post",
//                     },
//                 },
//             }
//         );

//         const userPosts = await UserModel.aggregate(pipeline).exec();

//         if (!userPosts || userPosts.length === 0) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "User was not found",
//                 },
//                 { status: 404 }
//             );
//         }

//         return Response.json(
//             {
//                 success: true,
//                 post: userPosts[0].post,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.log(error);

//         return Response.json(
//             {
//                 success: false,
//                 message: "Error fetching posts",
//             },
//             { status: 500 }
//         );
//     }
// }
import dbConnect from "@/lib/dbconnection";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose, { PipelineStage } from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    try {
        const pipeline: PipelineStage[] = [
            // Find logged-in user
            // {
            //     $match: {
            //         _id: userId,
            //     },
            // },

            // Convert post array into individual posts
            {
                $unwind: "$post",
            },
        ];

        // Filter category if not "all"
        if (category && category !== "All") {
            pipeline.push({
                $match: {
                    "post.category": category,
                },
            });
        }

        // Newest posts first
        pipeline.push(
            {
                $sort: {
                    "post.createdAt": -1,
                },
            },

            // Return post fields + user information
            {
                $project: {
                    _id: "$post._id",
                    title: "$post.title",
                    description: "$post.description",
                    files: "$post.files",
                    price: "$post.price",
                    category: "$post.category",
                    createdAt: "$post.createdAt",

                    // User information
                    username: "$username",
                    email: "$email",
                },
            }
        );

        const posts = await UserModel.aggregate(pipeline).exec();

        return Response.json(
            {
                success: true,
                post: posts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                message: "Error fetching posts",
            },
            { status: 500 }
        );
    }
}