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
            <div className="flex justify-center items-center h-40">
                Checking authorization...
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500 font-medium">
                    You are not authorized to upload content.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <h2 className="text-3xl font-bold text-center">
                        Upload Product
                    </h2>

                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Product Title
                                </FormLabel>

                                <Input
                                    placeholder="Enter product title"
                                    {...field}
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />  
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Product Category
                                </FormLabel>

                                <select
                                    {...field}
                                    className="border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Stationary">Stationary</option>
                                    <option value="Vehicles">Vehicles</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Other">Other</option>
                                </select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>

                                <textarea
                                    {...field}
                                    placeholder="Describe your product..."
                                    className="min-h-37.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Images */}
                    <FormField
                        control={form.control}
                        name="media"
                        render={({ field: { onChange } }) => (
                            <FormItem>
                                <FormLabel>
                                    Images
                                </FormLabel>

                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        onChange(
                                            e.target.files
                                        )
                                    }
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Price */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
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
                                />

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={uploading}
                    >
                        {uploading
                            ? 'Uploading...'
                            : 'Upload Product'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}