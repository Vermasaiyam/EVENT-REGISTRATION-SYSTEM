import { useState } from "react";
import EditEvent from "./EditEvent";
import { useEventStore } from "@/store/useEventStore";
import { Trash2 } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Club } from "@/types/clubType";

interface AllEventsProps {
    club: Club | null;
}

const AllEvents: React.FC<AllEventsProps> = ({ club }) => {
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<any>();

    const { deleteEvent } = useEventStore();

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };

    // Carousel state
    const [carouselIndex, setCarouselIndex] = useState(0);

    const [eventsPerPage, setEventsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);


    const totalEvents = club?.events.length || 0;
    const totalPages = Math.ceil(totalEvents / eventsPerPage);
    const allEvents = club?.events.slice().reverse();

    const currentEvents = allEvents?.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    );

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    const handleEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEventsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div>
            {
                currentEvents?.length !== 0 && (
                    <div className="flex items-center justify-end my-4 mx-2">
                        <label htmlFor="entriesPerPage" className="mr-2 text-gray-700 dark:text-gray-400">
                            Number of entries:
                        </label>
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

            {currentEvents?.map((event: any, idx: number) => {
                const today = new Date();
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(23, 59, 59, 999);
                const isRegistrationClosed = registrationEndDate < today;

                return (
                    <div key={idx} className="mt-6 space-y-4 hover:shadow-lg shadow-md">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 rounded-lg relative">
                            {/* Registration Status */}
                            <div
                                className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-md ${isRegistrationClosed ? 'bg-red-500 text-white' : 'bg-green text-white'
                                    }`}
                            >
                                {isRegistrationClosed ? 'Closed' : 'Open'}
                            </div>

                            {/* Primary Event Image */}
                            <img
                                src={event.image}
                                alt={event.name}
                                className="md:h-24 md:w-24 h-32 w-full object-contain rounded-lg"
                            />

                            {/* Delete Button */}
                            <div
                                onClick={() => deleteEvent(event._id)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 cursor-pointer text-xs text-white"
                            >
                                <Trash2 className="w-4 h-4" />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1">
                                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{event.name}</h1>
                                <p title={event.description} className="text-sm text-gray-600 mt-1 dark:text-gray-400 line-clamp-1">
                                    {event.description}
                                </p>

                                <h2 className="text-md font-semibold mt-2 flex items-center">
                                    Registration Fee:{' '}
                                    <span className="text-green dark:text-yellow-100 flex items-center mx-2">₹{event.registrationFee}</span>
                                </h2>

                                <div className="flex flex-col md:flex-row md:space-x-4 mt-3">
                                    <div className="text-sm text-gray-700 dark:text-gray-400">
                                        <span className="font-semibold">Registration End Date: </span>
                                        {registrationEndDate.toLocaleDateString('en-GB')}
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
                                size={'sm'}
                                className="bg-green hover:bg-hoverGreen mt-2 dark:text-white"
                            >
                                Edit
                            </Button>
                        </div>

                        {/* Carousel for Event Images */}
                        {event.images && event.images.length > 0 && (
                            <div className="relative w-full h-48 mt-4 rounded-lg overflow-hidden shadow-md">
                                {/* Display Current Image */}
                                <img
                                    src={event.images[carouselIndex]}
                                    alt={`Carousel Image ${carouselIndex + 1}`}
                                    className="w-full h-full object-contain"
                                />

                                {/* Navigation Buttons */}
                                <button
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full"
                                    onClick={() => setCarouselIndex((prevIndex) => (prevIndex - 1 + event.images.length) % event.images.length)}
                                >
                                    <FaAngleLeft />
                                </button>
                                <button
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full"
                                    onClick={() => setCarouselIndex((prevIndex) => (prevIndex + 1) % event.images.length)}
                                >
                                    <FaAngleRight />
                                </button>

                                {/* Dot Navigation */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {event.images.slice(0, 3).map((_: any, imgIdx: number) => (
                                        <div
                                            key={imgIdx}
                                            className={`h-2 w-2 rounded-full bg-gray-300 cursor-pointer ${carouselIndex === imgIdx ? 'bg-blue-600' : ''
                                                }`}
                                            onClick={() => setCarouselIndex(imgIdx)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {
                (club && currentEvents?.length !== 0) && (
                    <div className="flex justify-center space-x-2 mt-6">
                        <Button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            First
                        </Button>
                        <Button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            Previous
                        </Button>

                        {/* Page Number Buttons */}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Button
                                key={index}
                                onClick={() => goToPage(index + 1)}
                                className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-hoverGreen rounded-lg`}
                            >
                                {index + 1}
                            </Button>
                        ))}

                        <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                        >
                            Next
                        </Button>

                        <Button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
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

export default AllEvents