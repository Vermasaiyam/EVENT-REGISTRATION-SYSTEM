import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useClubStore } from "@/store/useClubStore";
import { Club } from "@/types/clubType";

const AllClubs = () => {
    const { loading, allClubs, fetchAllClubs } = useClubStore();
    // const loading: boolean = false;

    useEffect(() => {
        fetchAllClubs();
        console.log("all clubs",allClubs);
    }, []);

    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 md:gap-10 gap-8 md:mx-12 md:my-10 my-6 mx-6">
            {
                loading ? (
                    <SearchPageSkeleton />
                ) : !loading && allClubs?.length === 0 ? (
                    <NoResultFound />
                ) : (
                    allClubs?.map((club: Club) => (
                        <Card
                            key={club._id}
                            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="relative">
                                <AspectRatio ratio={15 / 8}>
                                    <img
                                        src={club.imageUrl}
                                        // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL_kIswlm4KDcOl6U--eJiLidCUvAzpZC5ZQ&s"
                                        alt={club.clubName}
                                        className="w-full h-full object-cover"
                                    />
                                </AspectRatio>
                            </div>
                            <CardContent className="p-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {club.clubName}
                                    {/* DataVerse */}
                                </h1>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {club.eventTypes.slice(0, 3).map(
                                        (event: string, idx: number) => (
                                            <Badge
                                                key={idx}
                                                className="font-medium px-2 py-1 rounded-full shadow-sm"
                                            >
                                                {event}
                                            </Badge>
                                        )
                                    )}
                                    {
                                        club.eventTypes.length > 3 && (
                                            <span className="text-xs text-gray-600 my-auto  dark:text-yellow-100">
                                                + {club.eventTypes.length - 3} more
                                                {/* + 3 more */}
                                            </span>
                                        )
                                    }
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                                <Link to={`/club/${club._id}`}>
                                    <Button className="bg-green hover:bg-hoverGreen dark:text-white font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                                        Explore
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )
            }

        </div>
    )
}

export default AllClubs;

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
        <div className="w-[100vw] h-36 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                No clubs found
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any clubs. <br />
            </p>
            {/* <Link to="/">
                <Button className="mt-4 bg-green hover:bg-hoverGreen dark:text-white">
                    Go Back to Home
                </Button>
            </Link> */}
        </div>
    );
};