import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useEventStore } from "@/store/useEventStore";
import { Event } from "@/types/eventType";
import { EventItem } from "@/types/clubType";

const AllEvents = () => {
    const { loading, allEvents, fetchAllEvents } = useEventStore();
    // const loading: boolean = false;
    const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);
    const [pastEvents, setPastEvents] = useState<EventItem[]>([]);

    const [activeEventsPerPage, setActiveEventsPerPage] = useState(6);

    // for active evnts
    const [currentActivePage, setCurrentActivePage] = useState(1);
    const totalActivePages = Math.ceil(activeEvents.length / activeEventsPerPage);

    const startActiveIndex = (currentActivePage - 1) * activeEventsPerPage;
    const currentActiveEvents = activeEvents.slice(startActiveIndex, startActiveIndex + activeEventsPerPage);


    const handleActiveNext = () => {
        if (currentActivePage < totalActivePages) setCurrentActivePage(currentActivePage + 1);
    };

    const handleActivePrev = () => {
        if (currentActivePage > 1) setCurrentActivePage(currentActivePage - 1);
    };

    const handleActiveFirst = () => setCurrentActivePage(1);
    const handleActiveLast = () => setCurrentActivePage(totalActivePages);

    const handleActiveEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveEventsPerPage(Number(event.target.value));
        setCurrentActivePage(1);
    };

    // for past events

    const [pastEventsPerPage, setPastEventsPerPage] = useState(6);

    const [currentPastPage, setCurrentPastPage] = useState(1);
    const totalPastPages = Math.ceil(pastEvents.length / pastEventsPerPage);

    const startPastIndex = (currentPastPage - 1) * pastEventsPerPage;
    const currentPastEvents = pastEvents.slice(startPastIndex, startPastIndex + pastEventsPerPage);


    const handlePastNext = () => {
        if (currentPastPage < totalPastPages) setCurrentPastPage(currentPastPage + 1);
    };

    const handlePastPrev = () => {
        if (currentPastPage > 1) setCurrentPastPage(currentPastPage - 1);
    };

    const handlePastFirst = () => setCurrentPastPage(1);
    const handlePastLast = () => setCurrentPastPage(totalPastPages);

    const handlePastEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPastEventsPerPage(Number(event.target.value));
        setCurrentPastPage(1);
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    useEffect(() => {
        if (allEvents) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const active = allEvents.filter(event => {
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(0, 0, 0, 0);
                return registrationEndDate >= today;
            });

            const past = allEvents.filter(event => {
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(0, 0, 0, 0);
                return registrationEndDate < today;
            });

            setActiveEvents(active.slice().reverse());
            setPastEvents(past.slice().reverse());
        }
    }, [allEvents]);

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };

    return (
        <div className="my-10 mx-4">
            <div className="flex flex-col w-full">
                <h1 className="text-2xl md:text-3xl font-semibold mx-16">Active Events</h1>
                {
                    activeEvents.length !== 0 && (
                        <div className="flex items-center justify-end mb-4 mx-2">
                            <label htmlFor="activeEntriesPerPage" className="mr-2 text-gray-700 dark:text-gray-400">Number of entries:</label>
                            <select
                                id="activeEntriesPerPage"
                                value={activeEventsPerPage}
                                onChange={handleActiveEntriesChange}
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
                <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-8 gap-8 md:mx-12 md:my-10 my-6 mx-6">
                    {
                        loading ? (
                            <SearchPageSkeleton />
                        ) : !loading && allEvents?.length === 0 ? (
                            <NoResultFound />
                        ) : (
                            currentActiveEvents?.map((event: Event) => (
                                <div key={event._id}>
                                    <Card className="max-w-sm shadow-xl hover:shadow-2xl rounded-lg overflow-hidden relative mx-2">
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
                            ))
                        )
                    }

                </div>

                {
                    activeEvents.length !== 0 && (
                        <div className="w-full flex items-center justify-center mt-4">
                            <div className="flex items-center space-x-2 overflow-y-scroll ml-2">
                                {/* First Button */}
                                <button
                                    onClick={handleActiveFirst}
                                    disabled={currentActivePage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    First
                                </button>

                                {/* Previous Button */}
                                <button
                                    onClick={handleActivePrev}
                                    disabled={currentActivePage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {Array.from({ length: totalActivePages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentActivePage(index + 1)}
                                        className={`px-4 py-2 text-sm rounded-md ${currentActivePage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen hover:text-white`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={handleActiveNext}
                                    disabled={currentActivePage === totalActivePages}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Next
                                </button>

                                {/* Last Button */}
                                <button
                                    onClick={handleActiveLast}
                                    disabled={currentActivePage === totalActivePages}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* if 0 active events */}
                {
                    activeEvents.length === 0 && (
                        <div className="flex items-center justify-center w-full mx-auto mb-12">
                            <p className="text-sm text-gray-800 dark:text-gray-400 text-center">No Active Events Found.</p>
                        </div>
                    )
                }


            </div>
            <div className="flex flex-col w-full">
                <h1 className="text-2xl md:text-3xl font-semibold mx-16">Past Events</h1>
                {
                    pastEvents.length !== 0 && (
                        <div className="flex items-center justify-end mb-4 mx-2">
                            <label htmlFor="pastEntriesPerPage" className="mr-2 text-gray-700 dark:text-gray-400">Number of entries:</label>
                            <select
                                id="pastEntriesPerPage"
                                value={pastEventsPerPage}
                                onChange={handlePastEntriesChange}
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
                <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-8 gap-8 md:mx-12 md:my-10 my-6 mx-6">
                    {
                        loading ? (
                            <SearchPageSkeleton />
                        ) : !loading && allEvents?.length === 0 ? (
                            <NoResultFound />
                        ) : (
                            currentPastEvents?.map((event: Event) => (
                                <div key={event._id}>
                                    <Card className="max-w-sm shadow-xl hover:shadow-2xl rounded-lg overflow-hidden relative mx-2">
                                        <Link to={event.name} state={{ event }} className="">
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-full lg:h-48 h-44 object-contain"
                                            />
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
                            ))
                        )
                    }

                </div>

                {
                    pastEvents.length !== 0 && (
                        <div className="w-full flex items-center justify-center mt-4">
                            <div className="flex items-center space-x-2 overflow-y-scroll ml-2">
                                {/* First Button */}
                                <button
                                    onClick={handlePastFirst}
                                    disabled={currentPastPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    First
                                </button>

                                {/* Previous Button */}
                                <button
                                    onClick={handlePastPrev}
                                    disabled={currentPastPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {Array.from({ length: totalPastPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPastPage(index + 1)}
                                        className={`px-4 py-2 text-sm rounded-md ${currentPastPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen hover:text-white`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                {/* Next Button */}
                                <button
                                    onClick={handlePastNext}
                                    disabled={currentPastPage === totalPastPages}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Next
                                </button>

                                {/* Last Button */}
                                <button
                                    onClick={handlePastLast}
                                    disabled={currentPastPage === totalPastPages}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
                                >
                                    Last
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* if 0 past events */}
                {
                    pastEvents.length === 0 && (
                        <div className="flex items-center justify-center w-full mx-auto mb-12">
                            <p className="text-sm text-gray-800 dark:text-gray-400 text-center">No Past Events Found.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default AllEvents;

const SearchPageSkeleton = () => {
    return (
        <>
            {[...Array(3)].map((_, index) => (
                <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
                >
                    <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                            <Skeleton className="w-full h-full" />
                        </AspectRatio>
                    </div>
                    <CardContent className="p-4">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

const NoResultFound = () => {
    return (
        <div className="w-[100vw] h-80 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                No results found.
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any events. <br />
            </p>
            <Link to="/">
                <Button className="mt-4 bg-green hover:bg-hoverGreen dark:text-white">
                    Go Back to Home
                </Button>
            </Link>
        </div>
    );
};