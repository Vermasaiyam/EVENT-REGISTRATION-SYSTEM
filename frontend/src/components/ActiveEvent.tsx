import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { EventFormSchema } from "@/schema/eventSchema";

const ActiveEvent = () => {

    const eventItems: EventFormSchema[] = [
        {
            name: "HacoVerse",
            description: "lorem gyrfudiosk vyfuhidjs ygfeijd sLorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.",
            mode: "Offline",
            registrationFee: 69,
            registrationEndDate: "2024-11-15",
            eventStartDate: "2024-11-16",
            eventEndDate: "2024-11-17",
            startTime: "10:00",
            endTime: "17:00",
            image: undefined,
            qrCode: undefined,
        },
        {
            name: "KT Session",
            description: "lorem gyrfudiosk vyfuhidjs ygfeijds Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.",
            mode: "Offline",
            registrationFee: 69,
            registrationEndDate: "2024-11-20",
            eventStartDate: "2024-11-21",
            eventEndDate: "2024-11-22",
            startTime: "14:00",
            endTime: "18:00",
            image: undefined,
            qrCode: undefined,
        },
    ];

    return (
        <div className="my-4">
            <h1 className="text-xl md:text-xl font-semibold mb-6">
                Active Events
            </h1>
            <div className="grid md:grid-cols-3 gap-4">
                {eventItems.map((event, idx) => (
                    <Link to={event.name} state={{ event }} key={idx}>
                        <Card className="max-w-xs shadow-lg rounded-lg overflow-hidden mx-2">
                            <img
                                src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                                alt={event.name}
                                className="w-full h-40 object-cover"
                            />
                            <CardContent className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {event.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-2 dark:text-gray-400 line-clamp-2">
                                    {event.description}
                                </p>
                                <div className="flex flex-col mt-3">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Fee:</span>
                                        <span className="text-green dark:text-yellow-100">₹{event.registrationFee}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Dates:</span>
                                        <span>{`${event.eventStartDate} - ${event.eventEndDate}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Timings:</span>
                                        <span>{`${event.startTime} - ${event.endTime}`}</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <Button
                                        variant={"outline"}
                                        className="rounded-full border border-green dark:border-yellow-50 dark:text-yellow-50 text-green hover:bg-green hover:text-white"
                                    >
                                        Register Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default ActiveEvent