'use client';

import React from 'react';
import dayjs from 'dayjs';
import {
  User,
  Mail,
  Tag,
  IndianRupee,
  CalendarDays,
  X,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';

export interface Post {
  _id: string;
  title: string;
  description: string;
  files: string[];
  createdAt: Date | string;
  price: number;
  category: string;
}

type PostCardProps = {
  post: Post;
  username: string;
  email: string;
//   onPostDelete: (postId: string) => void;
};

export function PostCard({
  post,
  username,
  email,
//   onPostDelete,
}: PostCardProps) {
    const handelpage = () => {
        window.location.href = `/post/${post._id}`;
    }

  return (
    <Card
    onClick={handelpage}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-[#0f172a]
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900">
        {post.files?.length > 0 ? (
          <img
            src={post.files[0]}
            alt={post.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            No image available
          </div>
        )}

        {/* Image gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/60
            via-transparent
            to-transparent
          "
        />
        </div>

        {/* Category */}
        <div className="absolute left-4 top-4">
          <Badge
            className="
              rounded-full
              border
              border-blue-400/30
              bg-blue-500/20
              px-3
              py-1
              text-blue-300
              backdrop-blur-md
            "
          >
            <Tag className="mr-1.5 h-3.5 w-3.5" />

            {post.category}
          </Badge>
        </div>

      {/* ================= CONTENT ================= */}
      <CardContent className="p-5 sm:p-6">

        {/* Title */}
        <h2
          className="
            mb-4
            line-clamp-2
            text-xl
            font-bold
            leading-tight
            text-white
          "
        >
          {post.title}
        </h2>

        {/* ================= USER ================= */}
        <div className="mb-5 flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-500/15
              text-blue-400
            "
          >
            <User className="h-5 w-5" />
          </div>

         

        </div>

        {/* ================= PRICE + CATEGORY ================= */}
        <div className="grid grid-cols-2 gap-3">


          {/* Category */}
          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900/70
              p-3
            "
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Tag className="h-3.5 w-3.5" />

              Category
            </div>

            <p className="truncate font-medium text-white">
              {post.category}
            </p>
          </div>

        </div>

    {/* </div> */}

      </CardContent>
    </Card>
  );
}