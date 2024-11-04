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
import { Loader2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import EditEvent from "./EditEvent";


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
        formLink: "",
    });

    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<any>();
    const loading: boolean = false;


    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const [error, setError] = useState<Partial<EventFormSchema>>({});

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(input);

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

            // API function


        } catch (error) {
            console.error("Error submitting form:", error);
        }


        setOpen(false);
    }

    const eventItems: EventFormSchema[] = [
        {
            name: "HacoVerse",
            description: "lorem gyrfudiosk vyfuhidjs ygfeijds",
            mode: "Offline",
            registrationFee: 69,
            registrationEndDate: "2024-11-15",
            eventStartDate: "2024-11-16",
            eventEndDate: "2024-11-17",
            startTime: "10:00",
            endTime: "17:00",
            image: undefined,
            formLink: "",
        },
        {
            name: "KT Session",
            description: "lorem gyrfudiosk vyfuhidjs ygfeijds",
            mode: "Offline",
            registrationFee: 69,
            registrationEndDate: "2024-11-20",
            eventStartDate: "2024-11-21",
            eventEndDate: "2024-11-22",
            startTime: "14:00",
            endTime: "18:00",
            image: undefined,
            formLink: "",
        },
    ];



    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between mx-2">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    My Events
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-green hover:bg-hoverGreen dark:text-white">
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
                                <Label>Event Mode</Label>
                                <Select
                                    // onValueChange={(newMode) => setInput({ ...input, mode: newMode })}
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

            </div>
            {eventItems.map((event: any, idx: number) => (
                <div key={idx} className="mt-6 space-y-4 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
                        <img
                            src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                            alt={event.name}
                            className="md:h-24 md:w-24 h-28 w-full object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {event.name}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{event.description}</p>

                            <h2 className="text-md font-semibold mt-2 flex items-center">
                                Registration Fee: <span className="text-green dark:text-yellow-100 flex items-center mx-2">₹{event.registrationFee}</span>
                            </h2>

                            <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Registration End Date: </span>
                                    {event.registrationEndDate}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Event Start Date: </span>
                                    {event.eventStartDate}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Event End Date: </span>
                                    {event.eventEndDate}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Mode: </span>
                                    <span className="capitalize">{event.mode}</span>
                                </div>
                            </div>

                            {/* New fields: Start Time and End Time */}
                            <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">Start Time: </span>
                                    {event.startTime}
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-400">
                                    <span className="font-semibold">End Time: </span>
                                    {event.endTime}
                                </div>
                            </div>

                            {/* QR Code Image Display */}
                            {/* {event.qrCode && (
                                <div className="mt-3">
                                    <span className="font-semibold">QR Code:</span>
                                    <img
                                        // src={URL.createObjectURL(event.qrCode)}
                                        src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                                        alt="QR Code"
                                        className="mt-1 h-16 w-16 object-cover rounded-md shadow"
                                    />
                                </div>
                            )} */}
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
                (eventItems.length === 0) && (
                    <div className="text-sm text-gray-600 text-center my-10">
                        No Events to display.
                    </div>
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