import { Badge } from "./ui/badge";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ActiveEvent from "./ActiveEvent";
import PastEvent from "./PastEvents";
import { useClubStore } from "@/store/useClubStore";
import { EventItem } from "@/types/clubType";
import { FaAngleLeft, FaAngleRight, FaEnvelope, FaInstagram, FaLinkedin, FaX } from "react-icons/fa6";

const ClubPage = () => {
    const params = useParams();
    const { singleClub, getSingleClub } = useClubStore();

    const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);
    const [pastEvents, setPastEvents] = useState<EventItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            await getSingleClub(params.id!);
        }
        fetchData();
    }, [params.id]);

    useEffect(() => {
        if (singleClub?.events) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const active = singleClub.events.filter(event => {
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(0, 0, 0, 0);
                return registrationEndDate >= today;
            });

            const past = singleClub.events.filter(event => {
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(0, 0, 0, 0);
                return registrationEndDate < today;
            });

            setActiveEvents(active);
            setPastEvents(past);
        }
    }, [singleClub]);

    const imageEventMap = pastEvents.map((event) => ({
        image: event.images?.[0],
        name: event.name,
        clubName: event.clubName,
    })).filter((item) => item.image);


    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageEventMap.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [imageEventMap.length]);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageEventMap.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imageEventMap.length - 1 : prevIndex - 1
        );
    };

    const currentImageData = imageEventMap[currentIndex];

    return (
        <div className="max-w-7xl mx-auto my-10 min-h-[60vh]">
            <div className="w-full mx-2">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={singleClub?.imageUrl || "Loading..."}
                        alt={singleClub?.clubName}
                        className="object-contain w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex w-full flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-bold md:text-3xl text-2xl my-2">
                            {singleClub?.clubName || "Loading..."}
                        </h1>
                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.eventTypes.map((event: string, idx: number) => (
                                <Badge key={idx}>{event}</Badge>
                            ))}
                        </div>

                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.events && <ActiveEvent events={activeEvents} />}
                        </div>

                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.events && <PastEvent events={pastEvents} />}
                        </div>

                        <h1 className="font-medium text-xl">Core Team</h1>
                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.coreTeam.map((member: string, idx: number) => (
                                <Badge variant={"secondary"} key={idx}>
                                    {member}
                                </Badge>
                            ))}
                        </div>
                        {
                            imageEventMap?.length > 0 && (
                                <div className="">
                                    <h2 className="font-semibold text-xl mt-10 mb-4">Flashback Frames</h2>
                                    <div className="carousel-container relative w-full h-80 overflow-hidden rounded-lg shadow-lg">
                                        {imageEventMap?.length > 0 ? (
                                            <>
                                                {/* Image */}
                                                <div className="carousel-image-container w-full h-full">
                                                    <img
                                                        src={currentImageData.image}
                                                        alt={`Event Image ${currentIndex + 1}`}
                                                        className="carousel-image w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                                                    />
                                                </div>

                                                {/* Event and Club Name Overlay */}
                                                <div className="absolute bottom-4 left-4 text-black dark:text-yellow-300">
                                                    <div className="text-xl font-bold">{currentImageData.name}</div>
                                                    <div className="text-md">{currentImageData.clubName}</div>
                                                </div>

                                                {/* Navigation Buttons */}
                                                <div className="carousel-nav absolute top-1/2 left-0 right-0 flex justify-between items-center px-4">
                                                    <button
                                                        onClick={prevImage}
                                                        className="carousel-nav-button bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                                                    >
                                                        <FaAngleLeft />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="carousel-nav-button bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                                                    >
                                                        <FaAngleRight />
                                                    </button>
                                                </div>

                                                {/* Dots Navigation */}
                                                <div className="dots-container absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                    {imageEventMap.map((_, index) => (
                                                        <span
                                                            key={index}
                                                            className={`dot h-2 w-2 rounded-full bg-white bg-opacity-50 cursor-pointer transition-opacity duration-300 ${index === currentIndex ? "bg-opacity-100" : ""
                                                                }`}
                                                            onClick={() => setCurrentIndex(index)}
                                                        ></span>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-center text-gray-500">No images available for this event.</p>
                                        )}
                                    </div>
                                </div>
                            )
                        }

                        {(singleClub?.instaHandle ||
                            singleClub?.linkedinHandle ||
                            singleClub?.xHandle ||
                            singleClub?.email) && (
                                <div className="">
                                    <h2 className="font-semibold text-xl mt-8 mb-6">Connect with Us</h2>
                                    <div className="flex gap-4">
                                        {singleClub?.instaHandle && (
                                            <a
                                                href={singleClub.instaHandle}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaInstagram size={24} className="text-pink-500 hover:text-pink-700" />
                                            </a>
                                        )}
                                        {singleClub?.linkedinHandle && (
                                            <a
                                                href={singleClub.linkedinHandle}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaLinkedin size={24} className="text-blue-600 hover:text-blue-800" />
                                            </a>
                                        )}
                                        {singleClub?.xHandle && (
                                            <a
                                                href={singleClub.xHandle}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaX size={24} className="text-blue-500 hover:text-blue-700" />
                                            </a>
                                        )}
                                        {singleClub?.email && (
                                            <a
                                                href={`mailto:${singleClub.email}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <FaEnvelope size={24} className="text-gray-700 hover:text-gray-900" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubPage;