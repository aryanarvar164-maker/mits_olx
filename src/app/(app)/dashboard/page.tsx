"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@/model/User";

export default function Dashboard() {
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const [posts, setPosts] = useState<Post[]>([]);

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
                    <h2>{post.title}</h2>
                    <p>{post.category}</p>
                </div>
            ))}
        </div>
    );
}