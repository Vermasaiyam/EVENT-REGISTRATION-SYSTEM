import { z } from "zod";

export const clubFormSchema = z.object({
    clubName: z.string().nonempty({ message: "Restaurant name is required" }),
    eventTypes: z.array(z.string()),
    coreTeam: z.array(z.string()),
    imageFile: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Image file is required" }),
});

export type ClubFormSchema = z.infer<typeof clubFormSchema>;