import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useEventStore } from "@/store/useEventStore";
import { Event } from "@/types/eventType";

const AllEvents = () => {
    const { loading, allEvents, fetchAllEvents } = useEventStore();
    // const loading: boolean = false;

    useEffect(() => {
        fetchAllEvents();
        console.log("all events", allEvents);
    }, []);

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(':');
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hoursIn12}:${minutes} ${ampm}`;
    };

    return (
        <div className="grid md:grid-cols-4 md:gap-8 gap-8 md:mx-12 md:my-10 my-6 mx-6">
            {
                loading ? (
                    <SearchPageSkeleton />
                ) : !loading && allEvents?.length === 0 ? (
                    <NoResultFound />
                ) : (
                    allEvents?.map((event: Event) => (
                        <div key={event._id}>
                            <Card className="max-w-sm shadow-lg rounded-lg overflow-hidden relative mx-2">
                                <Link to={event.name} state={{ event, isActive: true }} className="">
                                    <img
                                        src={event.image}
                                        alt={event.name}
                                        className="w-full h-40 object-cover"
                                    />
                                </Link>
                                <div className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer text-xs px-2 text-gray-600">
                                    {event.mode}
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
                    ))
                )
            }

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