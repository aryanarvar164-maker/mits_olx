"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@/model/User";
import { PostCard } from "@/components/PostCards";

export default function Dashboard() {
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const [posts, setPosts] = useState<Post[]>([]);

    const handlePostDelete = (postId: string) => {
        setPosts((currentPosts) =>
            currentPosts.filter((post) => String(post._id) !== postId)
        );
    };

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
        <div>
            <h1>{category}</h1>

            {posts.map((post) => (
                <div key={String(post._id)}>
                    <PostCard
                        post={{ ...post, _id: String(post._id) }}
                        username={post.username}
                        email={post.email}
                        onPostDelete={handlePostDelete}
                    />
                </div>
            ))}
        </div>
    );
}