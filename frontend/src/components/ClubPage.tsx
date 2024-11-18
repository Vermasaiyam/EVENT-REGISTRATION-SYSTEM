import { Badge } from "./ui/badge"
// import Event from "./Event"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ActiveEvent from "./ActiveEvent";
import PastEvent from "./PastEvents";
import { useClubStore } from "@/store/useClubStore";
// import { Event } from "@/types/eventType";
import { EventItem } from "@/types/clubType";
import { FaEnvelope, FaInstagram, FaLinkedin, FaX } from "react-icons/fa6";


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

    return (
        <div className="max-w-7xl mx-auto my-10 min-h-[60vh]">
            <div className="w-full mx-2">
                <div className="relative w-full h-32 md:h-64 lg:h-72 ">
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
                            {
                                singleClub?.events &&
                                <ActiveEvent events={activeEvents} />
                            }
                        </div>

                        <div className="flex gap-2 my-2 flex-wrap">
                            {
                                singleClub?.events &&
                                <PastEvent events={pastEvents} />
                            }
                        </div>

                        <h1 className="font-medium text-xl">
                            Core Team
                        </h1>
                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.coreTeam.map((member: string, idx: number) => (
                                <Badge variant={"secondary"} key={idx}>{member}</Badge>
                            ))}
                        </div>

                        {
                            (singleClub?.instaHandle || singleClub?.linkedinHandle || singleClub?.xHandle || singleClub?.email) && (
                                <div className="">
                                    <h2 className="font-semibold text-xl mt-8 mb-6">Connect with Us</h2>
                                    <div className="flex gap-4">
                                        {singleClub?.instaHandle && (
                                            <a href={singleClub.instaHandle} target="_blank" rel="noopener noreferrer">
                                                <FaInstagram size={24} className="text-pink-500 hover:text-pink-700" />
                                            </a>
                                        )}
                                        {singleClub?.linkedinHandle && (
                                            <a href={singleClub.linkedinHandle} target="_blank" rel="noopener noreferrer">
                                                <FaLinkedin size={24} className="text-blue-600 hover:text-blue-800" />
                                            </a>
                                        )}
                                        {singleClub?.xHandle && (
                                            <a href={singleClub.xHandle} target="_blank" rel="noopener noreferrer">
                                                <FaX size={24} className="text-blue-500 hover:text-blue-700" />
                                            </a>
                                        )}
                                        {singleClub?.email && (
                                            <a href={`mailto:${singleClub.email}`} target="_blank" rel="noopener noreferrer">
                                                <FaEnvelope size={24} className="text-gray-700 hover:text-gray-900" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubPage