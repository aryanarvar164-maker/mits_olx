'use client';

import React from 'react';
import dayjs from 'dayjs';
import {
  User,
  Mail,
  Tag,
  IndianRupee,
  CalendarDays,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  onPostDelete: (postId: string) => void; // 👈 was commented out, now active
};

export function PostCard({
  post,
  username,
  email,
  onPostDelete, // 👈 was missing from destructure, caused ReferenceError
}: PostCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-post/${post._id}`
      );

      toast.success(response.data.message);
      onPostDelete(post._id); // removes card from UI on success
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to delete post'
      );
    }
  };

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
      <div className="relative w-full overflow-hidden bg-[#EEF1E7]">
        {post.files?.length > 0 ? (
          <img
            src={post.files[0]}
            alt={post.title}
            className="h-auto max-h-[420px] w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#8A8368]">
            No image available
          </div>
        )}

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
      </div>

      {/* ================= CONTENT ================= */}
      <CardContent className="p-5 sm:p-6">
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
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* ================= PRICE + CATEGORY ================= */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* ================= DATE + REMOVE ================= */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div
            className="
              flex
              flex-col
              justify-center
              rounded-xl
              border
              border-[#E4DFCB]
              bg-[#F5F2E6]
              p-3
              text-sm
            "
          >
            <div className="flex items-center gap-1.5 text-xs text-[#8A8368]">
              <CalendarDays className="h-3.5 w-3.5" />
              Uploaded
            </div>
            <span className="font-medium text-[#14213D]">
              {dayjs(post.createdAt).format('MMM D, YYYY')}
            </span>
          </div>

          <button
            onClick={handleDeleteConfirm}
            className="
              rounded-xl
              border
              border-[#E4DFCB]
              bg-[#cc3e0a]
              p-3
              font-medium
              text-white
              hover:bg-[#a8330a]
              transition-colors
            "
          >
            Remove
          </button>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="mt-5">
  <h3 className="mb-2 text-sm font-semibold text-[#4B5566]">
    Description
  </h3>

  <p className="text-sm leading-6 text-[#5B6472]">
    {post.description}
  </p>
</div>
      </CardContent>
    </Card>
  );
}
