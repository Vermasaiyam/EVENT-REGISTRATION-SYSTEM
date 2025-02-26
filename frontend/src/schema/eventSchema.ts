import { z } from "zod";

export const eventSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    mode: z.enum(["Online", "Offline"], { message: "Mode must be either 'Online' or 'Offline'." }),
    registrationFee: z.number().min(0, { message: "Price can't be negative" }),
    registrationEndDate: z.string()
        .nonempty({ message: "Registration End Date is required." })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date format must be YYYY-MM-DD" }),
    eventStartDate: z.string()
        .nonempty({ message: "Event Start Date is required." })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date format must be YYYY-MM-DD" }),
    eventEndDate: z.string()
        .nonempty({ message: "Event End Date is required." })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date format must be YYYY-MM-DD" }),
    startTime: z.string().nonempty({ message: "Start Time is required." }),
    endTime: z.string().nonempty({ message: "End Time is required." }),
    image: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Image file is required" }),
    images: z
        .array(z.instanceof(File))  // Now, we are validating an array of files
        .max(3, { message: "You can upload up to 3 images only" })
        .optional()
        .refine((files) => files?.every((file) => file?.size > 0), { message: "Each image must be a non-empty file" }),  // Validate non-empty files
    formLink: z.string().nonempty({ message: "Form Link is required" })
});
export type EventFormSchema = z.infer<typeof eventSchema>;

export const editEventSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    mode: z.enum(["Online", "Offline"], { message: "Mode must be either 'Online' or 'Offline'." }),
    registrationFee: z.number().min(0, { message: "Price can't be negative" }),
    registrationEndDate: z.string().optional(),
    eventStartDate: z.string().optional(),
    eventEndDate: z.string().optional(),
    startTime: z.string().nonempty({ message: "Start Time is required." }),
    endTime: z.string().nonempty({ message: "End Time is required." }),
    // image: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Image file is required" }),
    image: z
    .union([z.instanceof(File), z.string().url()])
    .optional(),
    images: z
        .array(z.instanceof(File))
        .max(3, { message: "You can upload up to 3 images only" })
        .optional() // Keep it optional
        .refine((files) => files?.length === 0 || files?.every((file) => file.size > 0), {
            message: "Each image must be a non-empty file",
        }),
    formLink: z.string().nonempty({ message: "Form Link is required" })
});

export type EditEventFormSchema = z.infer<typeof editEventSchema>;