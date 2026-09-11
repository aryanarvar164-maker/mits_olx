'use client'
import { signOut, useSession } from "next-auth/react";
import React from "react";

import { Button } from "./ui/button";
import Link from 'next/link';
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const Navbar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const category = searchParams.get("category") || "all";

    const handleCategoryChange = (selectedCategory: string | null) => {
    if (!selectedCategory) return;
    router.push(`/dashboard?category=${selectedCategory}`);
};

    const { data: session } = useSession()

    return (
    <nav className="sticky top-0 z-40 bg-[#14213D] text-[#F5F3EA] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.5)] px-4 py-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">

        <a
        onClick={() => router.push("/dashboard")} 
        href="#" className="text-2xl font-extrabold tracking-tight uppercase mb-4 md:mb-0">
          MITS <span className="text-[#DFA106]">OXP</span>
        </a>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger
              className="
                w-full md:w-[160px]
                rounded-full
                border-white/15
                bg-white/10
                text-white
                backdrop-blur-sm
                hover:bg-white/15
                focus:ring-2
                focus:ring-[#DFA106]
                [&>svg]:text-[#DFA106]
              "
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border-[#E4DFCB] bg-[#14213D] text-white">
              <SelectItem value="All" className="focus:bg-[#DFA106]/20 focus:text-white">All</SelectItem>
              <SelectItem value="Electronics" className="focus:bg-[#DFA106]/20 focus:text-white">Electronics</SelectItem>
              <SelectItem value="Furniture" className="focus:bg-[#DFA106]/20 focus:text-white">Furniture</SelectItem>
              <SelectItem value="Vehicles" className="focus:bg-[#DFA106]/20 focus:text-white">Vehicles</SelectItem>
              <SelectItem value="Stationary" className="focus:bg-[#DFA106]/20 focus:text-white">Stationary</SelectItem>
              <SelectItem value="Other" className="focus:bg-[#DFA106]/20 focus:text-white">Other</SelectItem>
            </SelectContent>
          </Select>

          {session ? (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={() => router.push("/upload_content")}
                className="w-full md:w-auto rounded-full bg-[#DFA106] px-5 py-2 text-sm font-semibold text-[#14213D] shadow-sm transition hover:bg-[#c98f00] hover:-translate-y-0.5"
                variant='outline'
              >
                Upload Post
              </Button>

              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto rounded-full border border-white/20 bg-transparent px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                variant='outline'
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in" className="w-full md:w-auto">
              <Button className="w-full md:w-auto rounded-full bg-[#DFA106] px-5 py-2 text-sm font-semibold text-[#14213D] shadow-sm transition hover:bg-[#c98f00]" variant={'outline'}>
                Login
              </Button>
            </Link>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;