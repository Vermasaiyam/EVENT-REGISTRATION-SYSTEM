import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import EditEvent from "./EditEvent";
import { useEventStore } from "@/store/useEventStore";
import { useClubStore } from "@/store/useClubStore";


const AddEvents = () => {
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

    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<any>();
    // const loading: boolean = false;

    const { loading, createEvent, deleteEvent } = useEventStore();
    const { club } = useClubStore();


    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const [error, setError] = useState<Partial<EventFormSchema>>({});

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(input);

        const result = eventSchema.safeParse(input);
        console.log(result);

        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setError(fieldErrors as Partial<EventFormSchema>);
            return;
        }

        console.log("HII");


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

            console.log("hello");


            // API function
            await createEvent(formData);

        } catch (error) {
            console.error("Error submitting form:", error);
        }


        setOpen(false);
    }

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };

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

    // pagination 
    const eventsPerPage = 5; // Number of events to show per page
    const [currentPage, setCurrentPage] = useState(1);

    // Total number of events
    const totalEvents = club?.events.length || 0;

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    // Calculate which events to show based on the current page
    const currentEvents = club?.events.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );

    // Handler to navigate to a specific page
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle Next and Previous
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };



    // const eventItems: EventFormSchema[] = [
    //     {
    //         name: "HacoVerse",
    //         description: "lorem gyrfudiosk vyfuhidjs ygfeijds",
    //         mode: "Offline",
    //         registrationFee: 69,
    //         registrationEndDate: "2024-11-15",
    //         eventStartDate: "2024-11-16",
    //         eventEndDate: "2024-11-17",
    //         startTime: "10:00",
    //         endTime: "17:00",
    //         image: undefined,
    //         formLink: "",
    //     },
    //     {
    //         name: "KT Session",
    //         description: "lorem gyrfudiosk vyfuhidjs ygfeijds",
    //         mode: "Offline",
    //         registrationFee: 69,
    //         registrationEndDate: "2024-11-20",
    //         eventStartDate: "2024-11-21",
    //         eventEndDate: "2024-11-22",
    //         startTime: "14:00",
    //         endTime: "18:00",
    //         image: undefined,
    //         formLink: "",
    //     },
    // ];

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between mx-2">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    My Events
                </h1>
                <div className="">

                    {
                        club && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger>
                                    <Button disabled={club ? false : true} className="bg-green hover:bg-hoverGreen dark:text-white">
                                        <Plus className="mr-2" />
                                        Add Event
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add A New Event</DialogTitle>
                                        <DialogDescription>
                                            Create an event that attendees will never forget.
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
                                                placeholder="Enter Description of Event"
                                            />
                                            {error && (
                                                <span className="text-xs font-medium text-red-600">
                                                    {error.name}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Event Mode</Label>
                                            <Select
                                                onValueChange={(newMode: EventFormSchema["mode"]) => setInput({ ...input, mode: newMode })}
                                                defaultValue={input.mode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Event Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {["Online", "Offline"].map((mode: string, index: number) => (
                                                            <SelectItem key={index} value={mode}>
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
                                            <Label>Event Highlights <span className="text-xs text-gray-600">(Upload after event is over)</span></Label>
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
                </div>


            </div>
            {currentEvents?.map((event: any, idx: number) => (
                <div key={idx} className="mt-6 space-y-4 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border relative">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="md:h-24 md:w-24 h-32 w-full object-contain rounded-lg"
                        />
                        <div onClick={() => deleteEvent(event._id)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 cursor-pointer text-xs text-white">
                            <Trash2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {event.name}
                            </h1>
                            <p title={event.description} className="text-sm text-gray-600 mt-1 dark:text-gray-400 line-clamp-1">{event.description}</p>

                            <h2 className="text-md font-semibold mt-2 flex items-center">
                                Registration Fee: <span className="text-green dark:text-yellow-100 flex items-center mx-2">₹{event.registrationFee}</span>
                            </h2>

                            <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Registration End Date: </span>
                                    {new Date(event.registrationEndDate).toLocaleDateString('en-GB')}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Event Start Date: </span>
                                    {new Date(event.eventStartDate).toLocaleDateString('en-GB')}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Event End Date: </span>
                                    {new Date(event.eventEndDate).toLocaleDateString('en-GB')}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Mode: </span>
                                    <span className="capitalize">{event.mode}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Start Time: </span>
                                    {formatTime(event.startTime)}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">End Time: </span>
                                    {formatTime(event.endTime)}
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedEvent(event);
                                setEditOpen(true);
                            }}
                            size={"sm"}
                            className="bg-green hover:bg-hoverGreen mt-2 dark:text-white"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            ))}
            {
                club && (
                    <div className="flex justify-center space-x-2 mt-6">
                        <Button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        >
                            First
                        </Button>
                        <Button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        >
                            Previous
                        </Button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Button
                                key={index}
                                onClick={() => goToPage(index + 1)}
                                className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen rounded-lg`}
                            >
                                {index + 1}
                            </Button>
                        ))}

                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        >
                            Next
                        </Button>

                        <Button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                        >
                            Last
                        </Button>
                    </div>
                )
            }
            {
                (club?.events.length === 0) && (
                    <div className="text-sm text-gray-600 text-center my-10">
                        No Events to display.
                    </div>
                )
            }
            {
                !club && (
                    <p className="w-full text-center text-sm text-gray-800 dark:text-gray-500 my-28">
                        Please add your club first to create an event.
                    </p>

                )
            }
            <EditEvent
                selectedEvent={selectedEvent}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
            />
        </div>
    )
}

export default AddEvents