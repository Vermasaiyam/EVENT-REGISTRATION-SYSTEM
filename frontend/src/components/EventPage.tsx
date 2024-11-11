import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import "./css/CountdownStyles.css";

const EventPage = () => {
    const location = useLocation();
    const { event } = location.state || {};

    const [active, setActive] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [prevTimeLeft, setPrevTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const formatTime = (time: any) => {
        const [hours, minutes] = time.split(":");
        const hoursIn12 = hours % 12 || 12;
        const ampm = hours < 12 ? "AM" : "PM";
        return `${hoursIn12}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const today = new Date();
        const registrationEndDate = new Date(event.registrationEndDate);
        registrationEndDate.setHours(23, 59, 59, 999); 
        
        setActive(registrationEndDate >= today);
    }, [event.registrationEndDate]);

    const calculateTimeLeft = () => {
        const endDate = new Date(event.registrationEndDate);
        endDate.setHours(23, 59, 59, 999);

        const diff = endDate.getTime() - new Date().getTime();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            setPrevTimeLeft(timeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [event.registrationEndDate, timeLeft]);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % event.images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + event.images.length) % event.images.length);
    };

    const getImageUrl = (image: string | File) => {
        if (typeof image === "string") {
            return image;
        } else if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return "";
    };

    const hasChanged = (unit: keyof typeof timeLeft) => {
        return timeLeft[unit] !== prevTimeLeft[unit];
    };

    return (
        <div className="max-w-6xl mx-auto my-10 min-h-[60vh]">
            <div className="w-full mx-2">
                <div className="relative w-full h-32 md:h-64 lg:h-72 overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={event.image}
                        alt={event.name}
                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full p-1 text-sm px-2 text-gray-600 shadow">
                        {event.mode}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between my-5 mx-4">
                    <div className="flex-1">
                        <h1 className="font-bold text-3xl">{event.name}</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400"><strong>Organized by:</strong> {event.clubName}</p>
                        <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">{event.description}</p>
                    </div>
                    <div className="flex-1 mt-4 md:mt-0 md:ml-4">
                        <div className="bg-white p-5 rounded-lg shadow-md dark:bg-[#2E3A52]">
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-300 border-b-2 border-gray-200 pb-2">Event Details</h2>
                            <div className="flex flex-col space-y-2 mt-3 text-gray-700">
                                <div className="flex justify-between dark:text-white">
                                    <span className="font-semibold">Registration Fee:</span>
                                    <span className="font-bold text-green dark:text-yellow-100">₹{event.registrationFee}</span>
                                </div>
                                <div className="flex justify-between dark:text-white">
                                    <span className="font-semibold">Registration Ends:</span>
                                    <span>{new Date(event.registrationEndDate).toLocaleDateString('en-GB')}</span>
                                </div>
                                <div className="flex justify-between dark:text-white">
                                    <span className="font-semibold">Event Dates:</span>
                                    <span>{`${new Date(event.eventStartDate).toLocaleDateString('en-GB')} - ${new Date(event.eventEndDate).toLocaleDateString('en-GB')}`}</span>
                                </div>
                                <div className="flex justify-between dark:text-white">
                                    <span className="font-semibold">Timings:</span>
                                    <span>{`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</span>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            {
                                active ? (
                                    <div className="flex justify-center space-x-6 mt-6">
                                        <div className="flex flex-col items-center">
                                            <div className={`flip-card ${hasChanged("days") ? "flip" : ""}`}>
                                                <div className="flip-card-inner">
                                                    <div className="flip-card-front flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.days}
                                                    </div>
                                                    <div className="flip-card-back flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.days}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="mt-2 text-gray-700 font-semibold">Days</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`flip-card ${hasChanged("hours") ? "flip" : ""}`}>
                                                <div className="flip-card-inner">
                                                    <div className="flip-card-front flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.hours}
                                                    </div>
                                                    <div className="flip-card-back flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.hours}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="mt-2 text-gray-700 font-semibold">Hours</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`flip-card ${hasChanged("minutes") ? "flip" : ""}`}>
                                                <div className="flip-card-inner">
                                                    <div className="flip-card-front flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.minutes}
                                                    </div>
                                                    <div className="flip-card-back flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.minutes}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="mt-2 text-gray-700 font-semibold">Minutes</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`flip-card ${hasChanged("seconds") ? "flip" : ""}`}>
                                                <div className="flip-card-inner">
                                                    <div className="flip-card-front flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.seconds}
                                                    </div>
                                                    <div className="flip-card-back flex items-center justify-center text-3xl font-bold text-white bg-gray-600 rounded-lg">
                                                        {timeLeft.seconds}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="mt-2 text-gray-700 font-semibold">Seconds</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-center text-xl font-semibold text-red-500 animate-twinkle">Registration Closed!!!</p>
                                )
                            }

                            <div className="mt-5">
                                {active ? (
                                    <a href={event.formLink} target="_blank">
                                        <Button
                                            variant={"outline"}
                                            className="w-full bg-green text-white font-semibold py-2 rounded-lg shadow-md hover:bg-hoverGreen hover:text-white"
                                        >
                                            Register Now
                                        </Button>
                                    </a>
                                ) : (
                                    <Button
                                        disabled={true}
                                        variant={"outline"}
                                        className="w-full bg-green text-white font-semibold py-2 rounded-lg shadow-md hover:bg-hoverGreen hover:text-white"
                                    >
                                        Register Now
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Section for Event Images */}
                {!active && event.images && event.images.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-4">Event Highlights</h2>
                        <div className="relative">
                            <img
                                src={getImageUrl(event.images[currentIndex])}
                                alt={`Event Highlight ${currentIndex + 1}`}
                                className="w-full h-64 object-contain rounded-lg"
                            />
                            <button
                                onClick={prevImage}
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-400 dark:bg-gray-900 text-white p-2 rounded-full"
                            >
                                <FaAngleLeft />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-400 dark:bg-gray-900 text-white p-2 rounded-full"
                            >
                                <FaAngleRight />
                            </button>

                            {/* Dots Navigation */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {event.images.map((_: any, index: number) => (
                                    <span
                                        key={index}
                                        className={`dot h-2 w-2 rounded-full bg-white bg-opacity-50 cursor-pointer transition-opacity duration-300 ${index === currentIndex ? "bg-opacity-100" : ""
                                            }`}
                                        onClick={() => setCurrentIndex(index)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventPage;