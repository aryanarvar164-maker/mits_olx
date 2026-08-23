'use client';

//add report button when click router update
//also add category selection

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiResponse } from '@/types/ApiResponse';

const formSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters'),

    description: z
        .string()
        .min(10, 'Description is too short'),

    media: z
        .custom<FileList>()
        .refine(
            (files) => files.length > 0,
            'Please select at least one image'
        ),

    price: z
        .number()
        .min(1, 'Price must be greater than 0'),

    category: z
        .string()
        .min(1, 'Please select a category')
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadContent() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            title: '',
            description: '',
            media: undefined,
            price: 0,
            category: ''
        },
    });

    // Check authentication
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response =
                    await axios.get<ApiResponse>(
                        '/api/upload-content'
                    );

                if (response.data.success) {
                    setIsAuthorized(true);
                } else {
                    toast.error(
                        response.data.message ||
                        'You are not authorized.'
                    );
                }
            } catch (error) {
                console.error(error, "in this authorization have issue");

                toast.error(
                    'You are not authorized.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthorization();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            setUploading(true);

            const files = Array.from(data.media);

            const uploadedUrls: string[] = [];

            const cloudName =
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

            const uploadPreset =
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error(
                    'Cloudinary configuration is missing'
                );
            }

            // Upload every image to Cloudinary
            for (const file of files) {
                const formData = new FormData();

                formData.append('file', file);
                formData.append(
                    'upload_preset',
                    uploadPreset
                );

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                uploadedUrls.push(
                    response.data.secure_url
                );
            }

            // Save product information + Cloudinary URLs
            const response =
                await axios.post<ApiResponse>(
                    '/api/upload-content',
                    {
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        files: uploadedUrls,
                        category: data.category,
                    }
                );

            if (response.data.success) {
                toast.success(
                    'Product uploaded successfully!'
                );

                form.reset();
            } else {
                toast.error(
                    response.data.message ||
                    'Failed to upload product.'
                );
            }

        } catch (error) {
            console.error(
                'Upload error: in upload content page',
                error
            );

            toast.error(
                'Something went wrong while uploading.'
            );
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EEF1E7] text-[#14213D]">
                <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFA106]" />
                    Checking authorization...
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EEF1E7] px-4">
                <div className="rounded-2xl border border-[#E4DFCB] bg-[#FFFDF7] px-6 py-5 shadow-sm">
                    <p className="text-center font-semibold text-[#B23A5C]">
                        You are not authorized to upload content.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EEF1E7] bg-[radial-gradient(circle,#00000010_1px,transparent_1px)] bg-[length:18px_18px] px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="relative overflow-hidden rounded-3xl border border-[#E4DFCB] bg-[#FFFDF7] p-6 shadow-[0_2px_8px_-2px_rgba(20,33,61,0.15)] sm:p-10">

                    {/* Pushpin */}
                    <div className="absolute left-1/2 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#DFA106] ring-2 ring-white shadow-sm" />

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-7"
                        >
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#B23A5C]">
                                    New Listing
                                </p>
                                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[#14213D]">
                                    Upload Product
                                </h2>
                            </div>

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-[#4B5566]">
                                            Product Title
                                        </FormLabel>

                                        <Input
                                            placeholder="Enter product title"
                                            {...field}
                                            className="rounded-xl border-[#E4DFCB] bg-[#F5F2E6] px-4 py-2.5 text-sm text-[#14213D] placeholder:text-[#8A8368] focus-visible:ring-2 focus-visible:ring-[#DFA106] focus-visible:ring-offset-0"
                                        />

                                        <FormMessage className="text-[#B23A5C]" />
                                    </FormItem>
                                )}
                            />

                            {/* Category */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-[#4B5566]">
                                            Product Category
                                        </FormLabel>

                                        <select
                                            {...field}
                                            className="w-full appearance-none rounded-xl border border-[#E4DFCB] bg-[#F5F2E6] px-4 py-2.5 text-sm text-[#14213D] outline-none focus:ring-2 focus:ring-[#DFA106]"
                                        >
                                            <option value="">Select a category</option>
                                            <option value="Stationary">Stationary</option>
                                            <option value="Vehicles">Vehicles</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Other">Other</option>
                                        </select>

                                        <FormMessage className="text-[#B23A5C]" />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-[#4B5566]">
                                            Description
                                        </FormLabel>

                                        <textarea
                                            {...field}
                                            placeholder="Describe your product..."
                                            className="min-h-37.5 w-full rounded-xl border border-[#E4DFCB] bg-[#F5F2E6] px-4 py-2.5 text-sm text-[#14213D] placeholder:text-[#8A8368] outline-none focus:ring-2 focus:ring-[#DFA106]"
                                        />

                                        <FormMessage className="text-[#B23A5C]" />
                                    </FormItem>
                                )}
                            />

                            {/* Images */}
                            <FormField
                                control={form.control}
                                name="media"
                                render={({ field: { onChange } }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-[#4B5566]">
                                            Images
                                        </FormLabel>

                                        <div className="rounded-xl border border-dashed border-[#DFA106]/50 bg-[#F5F2E6] px-4 py-4">
                                            <Input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) =>
                                                    onChange(
                                                        e.target.files
                                                    )
                                                }
                                                className="border-0 bg-transparent p-0 text-sm text-[#14213D] file:mr-4 file:rounded-full file:border-0 file:bg-[#DFA106] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#14213D] file:transition hover:file:bg-[#c98f00]"
                                            />
                                        </div>

                                        <FormMessage className="text-[#B23A5C]" />
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wide text-[#4B5566]">
                                            Expected Price (₹)
                                        </FormLabel>

                                        <Input
                                            type="number"
                                            placeholder="Enter expected price"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                            className="rounded-xl border-[#E4DFCB] bg-[#F5F2E6] px-4 py-2.5 text-sm text-[#14213D] placeholder:text-[#8A8368] focus-visible:ring-2 focus-visible:ring-[#DFA106] focus-visible:ring-offset-0"
                                        />

                                        <FormMessage className="text-[#B23A5C]" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={uploading}
                                className="w-full rounded-full bg-[#DFA106] py-2.5 text-sm font-semibold text-[#14213D] shadow-sm transition hover:bg-[#c98f00] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {uploading
                                    ? 'Uploading...'
                                    : 'Upload Product'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}