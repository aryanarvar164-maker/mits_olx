"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@/model/User";
import { PostCard } from "@/components/PostCards";

export default function Dashboard() {
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const getPosts = async () => {
            const response = await fetch(
                `/api/get-posts?category=${category}`
            );

            const data = await response.json();

            if (data.success) {
                setPosts(data.post);
            }
        };

        getPosts();
    }, [category]);

    return (
        <div className="min-h-screen bg-[#EEF1E7] bg-[radial-gradient(circle,#00000010_1px,transparent_1px)] bg-[length:18px_18px] px-4 py-8 sm:px-8">
            <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-[#14213D]">
                Post Category: <span className="text-[#B23A5C] capitalize">{category}</span>
            </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
    {posts.map((post) => (
        <div
            key={String(post._id)}
            onClick={() => setSelectedPost(post)}
            className="
                group
                relative
                cursor-pointer
                overflow-hidden
                rounded-2xl
                border
                border-[#E4DFCB]
                bg-[#FFFDF7]
                shadow-[0_2px_8px_-2px_rgba(20,33,61,0.15)]
                transition-all
                duration-300
                [&:nth-child(odd)]:-rotate-1
                [&:nth-child(even)]:rotate-1
                hover:rotate-0
                hover:-translate-y-1
                hover:shadow-[0_12px_24px_-8px_rgba(20,33,61,0.35)]
            "
        >
            {/* Pushpin */}
            <div className="absolute left-1/2 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#DFA106] ring-2 ring-white shadow-sm" />

            {/* Full card image */}
            <div className="w-full h-40 overflow-hidden bg-[#EEF1E7]">
                <img
                    src={post.files[0]}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Small details */}
            <div className="p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#B23A5C]">
                    {post.category}
                </p>

                <h2 className="mt-1 text-sm font-bold truncate text-[#14213D]">
                    {post.title}
                </h2>
            </div>
        </div>
    ))}


            {/* Detailed post */}
            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-[#14213D]/70 backdrop-blur-sm flex items-center justify-center p-4">

                    <div className="relative bg-[#FFFDF7] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/5">

                        {/* Close button */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#14213D] text-white shadow-lg transition duration-300 hover:bg-[#B23A5C] hover:rotate-90"
                        >
                            ×
                        </button>

                        {/* Image */}
                        <PostCard 
                            post={selectedPost}
                            username={selectedPost.username}
                            email={selectedPost.email}
                        />
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}