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
//   const handleDeleteConfirm = async () => {
//     try {
//       const response = await axios.delete<ApiResponse>(
//         `/api/delete-post/${post._id}`
//       );

//       toast.success(response.data.message);

//       onPostDelete(post._id);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;

//       toast.error(
//         axiosError.response?.data.message ??
//           'Failed to delete post'
//       );
//     }
//   };

  return (
    <Card
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-[#E4DFCB]
        bg-[#FFFDF7]
        text-[#14213D]
        shadow-none
        transition-all
        duration-300
      "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-56 w-full overflow-hidden bg-[#EEF1E7]">
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
          <div className="flex h-full items-center justify-center text-[#8A8368]">
            No image available
          </div>
        )}

        {/* Image gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            via-transparent
            to-transparent
          "
        />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <Badge
            className="
              rounded-full
              border
              border-[#DFA106]/50
              bg-[#DFA106]/90
              px-3
              py-1
              text-[#14213D]
              font-semibold
              text-xs
              backdrop-blur-md
            "
          >
            <Tag className="mr-1.5 h-3.5 w-3.5" />

            {post.category}
          </Badge>
        </div>

        {/* Delete */}
        {/* <div className="absolute right-4 top-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="
                  h-9
                  w-9
                  rounded-full
                  bg-red-500/90
                  backdrop-blur-sm
                  hover:bg-red-600
                "
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this post?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This post will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div> */}
      </div>

      {/* ================= CONTENT ================= */}
      <CardContent className="p-5 sm:p-6">

        {/* Title */}
        <h2
          className="
            mb-4
            line-clamp-2
            text-xl
            font-extrabold
            leading-tight
            text-[#14213D]
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
              bg-[#B23A5C]/10
              text-[#B23A5C]
            "
          >
            <User className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-[#14213D]">
              {username}
            </p>

            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Mail className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {email}
              </span>
            </div>
          </div>

        </div>

        {/* ================= PRICE + CATEGORY ================= */}
        <div className="grid grid-cols-2 gap-3">

          {/* Price */}
          <div
            className="
              rounded-xl
              border
              border-[#E4DFCB]
              bg-[#F5F2E6]
              p-3
            "
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs text-[#8A8368]">
              <IndianRupee className="h-3.5 w-3.5" />

              Expected Price
            </div>

            <p className="font-semibold text-[#1B8A5A]">
              ₹{post.price.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Category */}
          <div
            className="
              rounded-xl
              border
              border-[#E4DFCB]
              bg-[#F5F2E6]
              p-3
            "
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs text-[#8A8368]">
              <Tag className="h-3.5 w-3.5" />

              Category
            </div>

            <p className="truncate font-medium text-[#14213D]">
              {post.category}
            </p>
          </div>

        </div>

        {/* ================= DATE ================= */}
        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[#E4DFCB]
            bg-[#F5F2E6]
            px-3
            py-3
            text-sm
          "
        >
          <CalendarDays className="h-4 w-4 text-[#8A8368]" />

          <span className="text-[#8A8368]">
            Uploaded
          </span>

          <span className="font-medium text-[#14213D]">
            {dayjs(post.createdAt).format('MMM D, YYYY')}
          </span>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="mt-5">

          <h3 className="mb-2 text-sm font-semibold text-[#4B5566]">
            Description
          </h3>

          <p
            className="
              line-clamp-3
              text-sm
              leading-6
              text-[#5B6472]
            "
          >
            {post.description}
          </p>

        </div>

      </CardContent>
    </Card>
  );
}