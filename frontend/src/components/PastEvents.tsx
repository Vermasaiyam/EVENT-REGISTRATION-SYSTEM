import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
// import { EventFormSchema } from "@/schema/eventSchema";
import { EventItem } from "@/types/clubType";
import { useState } from "react";

interface PastEventProps {
    events: EventItem[];
}

const PastEvent: React.FC<PastEventProps> = ({ events }) => {
    const eventsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };
    
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleFirst = () => setCurrentPage(1);
    const handleLast = () => setCurrentPage(totalPages);

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
    //         name: "Workshop",
    //         description: "lorem gyrfudiosk vyfuhidjs ygfeijds Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.",
    //         mode: "Online",
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
        <div className="my-2 w-full">
            <h1 className="text-2xl md:text-2xl font-semibold mb-6 mx-2">
                Past Events
            </h1>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                {currentEvents.map((event) => (
                    <div key={event._id}>
                        <Card className="max-w-md shadow-xl hover:shadow-2xl rounded-lg overflow-hidden relative mx-2">
                            <Link to={event.name} state={{ event }} className="">
                                <img src={event.image} alt={event.name} className="w-full lg:h-48 h-44 object-contain" />
                            </Link>
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer text-xs px-2 text-gray-600">
                                {event.mode}
                            </div>
                            <div className="absolute top-2 left-2 bg-red-500 rounded-full p-1 cursor-pointer text-xs px-2 text-extrabold text-white">
                                CLOSED
                            </div>
                            <CardContent className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {event.name}
                                </h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    <strong>Organized by:</strong> {event.clubName}
                                </p>
                                <p title={event.description} className="text-sm text-gray-600 mt-2 dark:text-gray-400 line-clamp-1">
                                    {event.description}
                                </p>
                                <div className="flex flex-col mt-3">
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Dates:</span>
                                        <span>{`${new Date(event.eventStartDate).toLocaleDateString('en-GB')} - ${new Date(event.eventEndDate).toLocaleDateString('en-GB')}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Timings:</span>
                                        <span>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center mt-4">
                <div className="flex items-center space-x-2">
                    {/* First Button */}
                    <button
                        onClick={handleFirst}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                    >
                        First
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 text-sm rounded-md ${currentPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                    >
                        Next
                    </button>

                    {/* Last Button */}
                    <button
                        onClick={handleLast}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                    >
                        Last
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center w-full mx-auto">
                {events.length === 0 && (
                    <p className="text-sm text-gray-800 dark:text-gray-400 text-center">No Past Events Found.</p>
                )}
            </div>


        </div>
    )
}

export default PastEvent