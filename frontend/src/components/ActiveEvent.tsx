import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
// import { EventFormSchema } from "@/schema/eventSchema";
import { EventItem } from "@/types/clubType";

interface ActiveEventProps {
    events: EventItem[];
}

const ActiveEvent: React.FC<ActiveEventProps> = ({ events }) => {

    // console.log("events", events);

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };



    // const eventItems: EventFormSchema[] = [
    //     {
    //         name: "HacoVerse",
    //         description: "lorem gyrfudiosk vyfuhidjs ygfeijd sLorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.",
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
    //         description: "lorem gyrfudiosk vyfuhidjs ygfeijds Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.",
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
        <div className="my-4 w-full">
            <h1 className="text-2xl md:text-2xl font-semibold mb-6 mx-2">
                Active Events
            </h1>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                {events?.map((event) => (
                    <div key={event._id}>
                        <Card className="max-w-md shadow-lg rounded-lg overflow-hidden relative mx-2">
                            <Link to={event.name} state={{ event}} className="">
                                <img
                                    // src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                                    src={event.image}
                                    alt={event.name}
                                    className="w-full h-52 object-contain"
                                />
                            </Link>
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer text-xs px-2 text-gray-600">
                                {event.mode}
                            </div>
                            <div className="absolute top-2 left-2 bg-green rounded-full p-1 cursor-pointer text-xs px-2 text-extrabold text-white">
                                OPEN
                            </div>
                            <CardContent className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {event.name}
                                </h2>
                                <p title={event.description} className="text-sm text-gray-600 mt-2 dark:text-gray-400 line-clamp-1">
                                    {event.description}
                                </p>
                                <div className="flex flex-col mt-3">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Fee:</span>
                                        <span className="text-green dark:text-yellow-100">₹{event.registrationFee}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Registration Ends:</span>
                                        <span>{new Date(event.registrationEndDate).toLocaleDateString('en-GB')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Dates:</span>
                                        <span>{`${new Date(event.eventStartDate).toLocaleDateString('en-GB')} - ${new Date(event.eventEndDate).toLocaleDateString('en-GB')}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Timings:</span>
                                        <span>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <a href={event.formLink} target="_blank">
                                        <Button
                                            variant={"outline"}
                                            className="rounded-full border border-green dark:border-yellow-50 dark:text-yellow-50 text-green hover:bg-green hover:text-white"
                                        >
                                            Register Now
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center w-full mx-auto">
                {events.length === 0 && (
                    <p className="text-sm text-gray-800 dark:text-gray-400 text-center">No Active Events Found.</p>
                )}
            </div>
        </div>
    )
}

export default ActiveEvent