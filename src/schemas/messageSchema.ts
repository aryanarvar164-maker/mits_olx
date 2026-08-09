import {z} from 'zod';

export const messageSchema  = z.object({
    content: z.string({message: "Content is required"})
    .min(10, {message: "Content must be at least 10 characters"})
    .max(300, {message: "Content cannot exceed 300 characters"})
})