import { z } from "zod";

export const clubFormSchema = z.object({
    clubName: z.string().nonempty({ message: "Restaurant name is required" }),
    eventTypes: z.array(z.string()),
    coreTeam: z.array(z.string()),
    instaHandle: z.string().optional(),
    linkedinHandle: z.string().optional(),
    xHandle: z.string().optional(),
    email: z.string().optional(),
    imageFile: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Image file is required" }),
});

export type ClubFormSchema = z.infer<typeof clubFormSchema>;