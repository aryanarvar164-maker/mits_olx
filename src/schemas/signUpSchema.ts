import {z} from 'zod';

export const usernameValidation = z
    .string()
    // .min(2,"username must be at least 2 characters")
    // .max(30,"username must be at most 30 characters")
    // .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers, and underscores"
    // );


export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message: "Please enter a valid email address"}),
    password : z.string().min(6, {message: "password must be at least 6 characters"}),
});