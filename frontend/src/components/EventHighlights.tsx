import { EventItem } from "@/types/clubType";
import React, { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface EventProps {
    events: EventItem[];
}

const EventHighlights: React.FC<EventProps> = ({ events }) => {

    const imageEventMap = events.flatMap((event) =>
        event.images?.map((image) => ({
            image,
            name: event.name,
            clubName: event.clubName,
        })) || []
    );

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
        <div className="mx-2">

            <div className="event-highlights max-w-7xl mx-auto my-10 py-8">
                <h2 className="text-2xl font-semibold mb-6">Event Highlights</h2>

                {/* Carousel Container */}
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
        </div>
    );
};

export default EventHighlights;