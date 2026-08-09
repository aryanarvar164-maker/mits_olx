import {z} from 'zod';

export const acceptMessageSchema  = z.object({
    acceptmessages: z.boolean({message: "acceptmessages is required"})
})