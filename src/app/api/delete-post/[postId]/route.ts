import dbConnect from "@/lib/dbconnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
      );
    }

    const { postId } = await params; // 👈 Next.js 16: params is a Promise, must await

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return Response.json(
        { success: false, message: "Invalid post id" },
        { status: 400 }
      );
    }

    const userId = (session.user as { _id: string })._id;

    // $pull only succeeds if this postId exists inside THIS user's own post[] array
    const result = await UserModel.updateOne(
      { _id: userId },
      { $pull: { post: { _id: postId } } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Post not found or you don't own this post" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
