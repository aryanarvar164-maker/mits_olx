'use client'
import { signOut, useSession } from "next-auth/react";
import React from "react";

import { Button } from "./ui/button";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";


const Navbar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedCategory = e.target.value;

        router.push(`/dashboard?category=${selectedCategory}`);
    };
    const { data: session } = useSession()

    return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        <select value={category} onChange={handleCategoryChange}>
            <option value="all">All</option>
            <option value="technology">Technology</option>
            <option value="Vehical">Vehical</option>
            <option value="Stationary">stationary</option>
            <option value="news">News</option>
        </select>
        {session ? (
          <>
            {/* <span className="mr-4">
              Welcome, {user.username || user.email}
            </span> */}
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
        
      </div>
    </nav>
  );
}

export default Navbar;