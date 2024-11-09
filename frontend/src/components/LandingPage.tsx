import { useEffect, useRef, useState } from "react";
import { EventItem } from "@/types/clubType";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Typed from 'typed.js';
import HelpingSection from "./HelpingSection";
import AllClubs from "./AllClubs";
import ActiveEvent from "./ActiveEvent";
import PastEvent from "./PastEvents";
import EventCarousel from "./EventCarousel";
import EventHighlights from "./EventHighlights";
import { Search } from "lucide-react";
import { useEventStore } from "@/store/useEventStore";

const LandingPage = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");
    const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);
    const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
    const { allEvents, fetchAllEvents } = useEventStore();
    const [eventMessages, setEventMessages] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            await fetchAllEvents();
        }
        fetchData();
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
            setActiveEvents(active);

            const past = allEvents.filter(event => {
                const registrationEndDate = new Date(event.registrationEndDate);
                registrationEndDate.setHours(0, 0, 0, 0);
                return registrationEndDate < today;
            });
            setPastEvents(past);
        }
    }, [allEvents]);

    // Create scrolling event messages dynamically
    useEffect(() => {
        if (activeEvents.length > 0) {
            const messages = activeEvents.map(
                (event) => `"${event.clubName}" is hosting a new event: "${event.name}"`
            );
            setEventMessages(messages.join("      |      "));
        }
    }, [activeEvents]);

    const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search/${searchText}`);
        }
    }

    const typedElement = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const options = {
            strings: ['The Excitement', 'The Passion', 'The Energy', 'The Community'],
            loop: true,
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
        };

        const typed = new Typed(typedElement.current!, options);

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className="">
            {/* Scrolling Text */}
            {eventMessages && (
                <div
                    className="bg-yellow-700 dark:bg-yellow-500 text-white dark:text-black p-2 text-center w-full overflow-hidden"
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    draggable={false}
                >
                    <div className="relative inline-block whitespace-nowrap group">
                        <div className="inline-block animate-marquee text-lg font-semibold group-hover:animate-marquee-paused">
                            {eventMessages}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row max-w-8xl lg:mx-20 md:mx-12 mx-4 py-4 px-6 bg-lightGreen dark:bg-[#2E3A52] md:p-10 rounded-lg items-center justify-around m-4 gap-10 box-border">
                <div className="flex flex-1 flex-col lg:gap-10 md:gap-7 gap-5 md:w-[40%]">
                    <div className="flex flex-col md:gap-5 gap-2">
                        <h1
                            className="md:font-bold font-bold lg:leading-none md:leading-tight lg:font-extrabold md:text-5xl text-4xl"
                            onCopy={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                            draggable={false}
                        >
                            Quickly Connecting You to <span ref={typedElement}></span>
                        </h1>
                        <p className="text-gray-500 dark:text-white">
                            Join the Excitement with a Click!
                        </p>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <Input
                            type="text"
                            value={searchText}
                            placeholder="Search events by its Name or Club Name."
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-10 shadow-lg"
                            onKeyDown={(e) => keyDown(e)}
                        />
                        <Search className="text-gray-500 absolute inset-y-2 left-2" />

                        <Button onClick={() => navigate(`/search/${searchText}`)} className="px-2 md:py-1 py-1 md:text-base text-sm text-white shadow-lg bg-green hover:bg-hoverGreen rounded-sm">Search</Button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    {
                        activeEvents.length === 0 ? (
                            <img
                                src="bg.png"
                                alt="Background Image"
                                className="object-fit lg:max-h-[550px] lg:min-h-[450px] md:max-h-[450px] md:min-h-[350px] max-h-[350px] min-h-[280px]"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-red-500 font-semibold mb-1 text-2xl animate-twinkle">NEW EVENTS!!!</p>
                                <EventCarousel events={activeEvents} />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* All Clubs */}
            <div className="lg:px-10 px-2 pt-8">
                <h1 className="md:text-3xl text-2xl font-semibold md:px-12 px-6">Our Clubs & Societies</h1>
                <AllClubs />
            </div>

            {/* All Events */}
            <div className="w-[100vw] lg:px-20 md:px-6 pt-4">
                {activeEvents.length > 0 && <ActiveEvent events={activeEvents} />}
            </div>

            <div className="w-[100vw] lg:px-20 md:px-6 pt-4">
                {pastEvents.length > 0 && <PastEvent events={pastEvents} />}
            </div>

            <EventHighlights events={pastEvents} />
            <HelpingSection />
        </div>
    )
}

export default LandingPage;