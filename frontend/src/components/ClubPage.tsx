import { Badge } from "./ui/badge"
// import Event from "./Event"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ActiveEvent from "./ActiveEvent";
import PastEvent from "./PastEvents";
import { useClubStore } from "@/store/useClubStore";
// import { Event } from "@/types/eventType";
import { EventItem } from "@/types/clubType";


const ClubPage = () => {

    const params = useParams();
    const { singleClub, getSingleClub } = useClubStore();

    const [activeEvents, setActiveEvents] = useState<EventItem[]>([]);
    const [pastEvents, setPastEvents] = useState<EventItem[]>([]);


    useEffect(() => {
        async function fetchData() {
            await getSingleClub(params.id!);

            if (singleClub?.events) {
                const today = new Date();

                const active = singleClub.events.filter(event => {
                    const registrationEndDate = new Date(event.registrationEndDate);
                    return registrationEndDate > today;
                });
                setActiveEvents(active);

                const past = singleClub.events.filter(event => {
                    const registrationEndDate = new Date(event.registrationEndDate);
                    return registrationEndDate < today;
                });
                setPastEvents(past);
            }
        }

        fetchData();
    }, [params.id, singleClub]);


    return (
        <div className="max-w-6xl mx-auto my-10 min-h-[60vh]">
            <div className="w-full mx-2">
                <div className="relative w-full h-32 md:h-64 lg:h-72 ">
                    <img
                        src={singleClub?.imageUrl || "Loading..."}
                        // src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                        alt="Club Cover Image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex w-full flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-bold md:text-3xl text-2xl">
                            {singleClub?.clubName || "Loading..."}
                            {/* DataVerse */}
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
                            {/* <ActiveEvent /> */}
                        </div>

                        <div className="flex gap-2 my-2 flex-wrap">
                            {
                                singleClub?.events &&
                                <PastEvent events={pastEvents} />
                            }
                            {/* <PastEvent /> */}
                        </div>

                        <h1 className="font-medium text-xl">
                            Core Team
                        </h1>
                        <div className="flex gap-2 my-2 flex-wrap">
                            {singleClub?.coreTeam.map((member: string, idx: number) => (
                                <Badge variant={"secondary"} key={idx}>{member}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubPage