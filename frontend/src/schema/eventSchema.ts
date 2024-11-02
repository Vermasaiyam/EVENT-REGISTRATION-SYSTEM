import { z } from "zod";

export const eventSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    mode: z.enum(["Online", "Offline"], { message: "Mode must be either 'online' or 'offline'." }),
    registrationFee: z.number().min(0, { message: "Price can't be negative" }),
    registrationEndDate: z.string().date().nonempty({message: "Registration End Date is required."}),
    eventStartDate: z.string().date().nonempty({message: "Event start Date is required."}),
    eventEndDate: z.string().date().nonempty({message: "Event End Date is required."}),
    image: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Image file is required" }),
});
export type EventFormSchema = z.infer<typeof eventSchema>;