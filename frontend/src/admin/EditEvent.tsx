import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventFormSchema, eventSchema } from "@/schema/eventSchema";
import { Loader2, X } from "lucide-react";
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { useEventStore } from "@/store/useEventStore";

const EditEvent = ({ selectedEvent, editOpen, setEditOpen }: { selectedEvent: any, editOpen: boolean, setEditOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [input, setInput] = useState<EventFormSchema>({
        name: "",
        description: "",
        mode: "Offline", // default
        registrationFee: 0,
        registrationEndDate: new Date().toISOString().split("T")[0],
        eventStartDate: new Date().toISOString().split("T")[0],
        eventEndDate: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        image: undefined,
        images: [],
        formLink: "",
    });

    // const loading: boolean = false;

    const { loading, editEvent } = useEventStore();


    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const [error, setError] = useState<Partial<EventFormSchema>>({});

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = eventSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setError(fieldErrors as Partial<EventFormSchema>);
            return;
        }

        // api
        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("mode", input.mode);
            formData.append("registrationFee", input.registrationFee.toString());
            formData.append("registrationEndDate", input.registrationEndDate);
            formData.append("eventStartDate", input.eventStartDate);
            formData.append("eventEndDate", input.eventEndDate);
            formData.append("startTime", input.startTime);
            formData.append("endTime", input.endTime);
            formData.append("formLink", input.formLink);

            if (input.image) {
                formData.append("image", input.image);
            }

            if (input.images) {
                input.images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
            }

            // api function
            await editEvent(selectedEvent._id, formData);

        } catch (error) {
            console.log(error);
        }

        setEditOpen(false);
    }

    // Handle the image change event
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            // Ensure that no more than 3 images are uploaded
            const currentImages = input.images ?? [];
            if (currentImages.length + newImages.length <= 3) {
                setInput((prev) => ({
                    ...prev,
                    images: [...currentImages, ...newImages],
                }));
            } else {
                alert("You can only upload up to 3 images.");
            }
        }
    };


    // Handle image deletion
    const handleDeleteImage = (index: number) => {
        setInput((prev) => ({
            ...prev,
            images: (prev.images ?? []).filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        setInput({
            name: selectedEvent?.name || "",
            description: selectedEvent?.description || "",
            mode: selectedEvent?.mode || "Offline",
            registrationFee: selectedEvent?.registrationFee || 0,
            registrationEndDate: selectedEvent?.registrationEndDate || "",
            eventStartDate: selectedEvent?.eventStartDate || "",
            eventEndDate: selectedEvent?.eventEndDate || "",
            startTime: selectedEvent?.startTime || "",
            endTime: selectedEvent?.endTime || "",
            image: undefined,
            formLink: selectedEvent?.formLink || "",
        });
    }, [selectedEvent]);



    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Revitalize your event with fresh updates to keep your attendees engaged and excited!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                            placeholder="Enter Event Name"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.name}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler}
                            placeholder="Enter Event Description"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.description}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Event Mode</Label>
                        <Select
                            // onValueChange={(newMode) => handleModeChange(newMode)}
                            defaultValue={input.mode} // Ensure you have a mode property in your input state
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Event Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {["Online", "Offline"].map((mode: string, index: number) => (
                                        <SelectItem key={index} value={mode.toLowerCase()}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.mode}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Registration Fee</Label>
                        <Input
                            type="number"
                            name="registrationFee"
                            value={input.registrationFee}
                            onChange={changeEventHandler}
                            placeholder="Enter Event Registration Fee"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.registrationFee}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Registration End Date</Label>
                        <Input
                            type="date"
                            name="registrationEndDate"
                            value={input.registrationEndDate}
                            onChange={changeEventHandler}
                            placeholder="Select Registration End Date"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.registrationEndDate}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label>Event Start Date</Label>
                        <Input
                            type="date"
                            name="eventStartDate"
                            value={input.eventStartDate}
                            onChange={changeEventHandler}
                            placeholder="Select Event Start Date"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.eventStartDate}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label>Event End Date</Label>
                        <Input
                            type="date"
                            name="eventEndDate"
                            value={input.eventEndDate}
                            onChange={changeEventHandler}
                            placeholder="Select Event End Date"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.eventEndDate}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Event Start Time</Label>
                        <Input
                            type="time"
                            name="startTime"
                            value={input.startTime}
                            onChange={changeEventHandler}
                            placeholder="Select Event Start Time"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.startTime}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label>Event End Time</Label>
                        <Input
                            type="time"
                            name="endTime"
                            value={input.endTime}
                            onChange={changeEventHandler}
                            placeholder="Select Event End Time"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.endTime}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label>Upload Event Image</Label>
                        <Input
                            type="file"
                            name="image"
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    image: e.target.files?.[0] || undefined,
                                })
                            }
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.image?.name}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label>Registration From Link</Label>
                        <Input
                            type="text"
                            name="formLink"
                            value={input.formLink}
                            onChange={changeEventHandler}
                            placeholder="Enter Registration form Link"
                        />
                        {error && (
                            <span className="text-xs font-medium text-red-600">
                                {error.formLink}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label>Upload Event Images <span className="text-xs text-gray-600">(Upload after event is over)</span></Label>
                        {(input.images?.length ?? 0) > 0 && (
                            <div className="flex gap-2 mb-3">
                                {input.images?.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={URL.createObjectURL(image)} alt={`Event Image ${index + 1}`} className="w-24 h-24 object-cover" />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-600"
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Input
                            type="file"
                            name="images"
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                        />
                        <span className="text-xs text-gray-500">*Upload images after the event is completed to display on the event page. (Max 3 images)</span>
                    </div>

                    <DialogFooter className="mt-5">
                        {loading ? (
                            <Button disabled className="w-full bg-green hover:bg-hoverGreen dark:text-white">
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button className="w-full bg-green hover:bg-hoverGreen dark:text-white">
                                Submit
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditEvent