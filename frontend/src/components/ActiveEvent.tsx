import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { EventItem } from "@/types/clubType";
import { useState } from "react";

interface ActiveEventProps {
    events: EventItem[];
}

const ActiveEvent: React.FC<ActiveEventProps> = ({ events }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(6);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const startIndex = (currentPage - 1) * eventsPerPage;
    const currentEvents = events.slice(startIndex, startIndex + eventsPerPage);

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(":");
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? "AM" : "PM";
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

    const handleEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEventsPerPage(Number(event.target.value));
        setCurrentPage(1)
    };

    return (
        <div className="my-4 w-full">
            <h1 className="text-2xl md:text-2xl font-semibold mb-6 mx-2">Active Events</h1>

            {/* Entries per page selector */}
            {
                events.length !== 0 && (
                    <div className="flex items-center justify-end mb-4 mx-2">
                        <label htmlFor="entriesPerPage" className="mr-2 text-gray-700 dark:text-gray-400">Number of entries:</label>
                        <select
                            id="entriesPerPage"
                            value={eventsPerPage}
                            onChange={handleEntriesChange}
                            className="border border-gray-300 rounded-md p-1 dark:bg-gray-800 dark:text-white"
                        >
                            {[2, 3, 4, 5, 6, 7, 8].map((number) => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            }

            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                {currentEvents?.map((event) => (
                    <div key={event._id}>
                        <Card className="max-w-md shadow-xl hover:shadow-2xl rounded-lg overflow-hidden relative mx-2">
                            <Link to={event.name} state={{ event }} className="">
                                <img
                                    src={event.image}
                                    alt={event.name}
                                    className="w-full lg:h-52 h-48 object-contain"
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
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    <strong>Organized by:</strong> {event.clubName}
                                </p>
                                <p title={event.description} className="text-sm text-gray-600 mt-2 dark:text-gray-400 line-clamp-1">
                                    {event.description}
                                </p>
                                <div className="flex flex-col mt-3">
                                    <div className="flex justify-between text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Fee:</span>
                                        <span className="text-green font-bold dark:text-yellow-100">₹{event.registrationFee}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Registration Ends:</span>
                                        <span>{new Date(event.registrationEndDate).toLocaleDateString("en-GB")}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 text-sm dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Dates:</span>
                                        <span>{`${new Date(event.eventStartDate).toLocaleDateString("en-GB")} - ${new Date(event.eventEndDate).toLocaleDateString("en-GB")}`}</span>
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

            {/* Pagination controls */}
            {events.length !== 0 && (
                <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center space-x-2 overflow-y-scroll ml-2">
                        <button
                            onClick={handleFirst}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            First
                        </button>
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 text-sm rounded-md ${currentPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen hover:text-white`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            Next
                        </button>
                        <button
                            onClick={handleLast}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}

            {events.length === 0 && (
                <div className="flex items-center justify-center w-full mx-auto">
                    <p className="text-sm text-gray-800 dark:text-gray-400 text-center">No Active Events Found.</p>
                </div>
            )}
        </div>
    );
};

export default ActiveEvent;