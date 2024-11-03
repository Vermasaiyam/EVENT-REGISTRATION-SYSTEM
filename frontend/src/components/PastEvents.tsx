import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

const PastEvent = () => {

    return (
        <div className="my-2">
            <h1 className="text-xl md:text-xl font-semibold mb-6">
                Past Events
            </h1>
            <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
                {["Hackathons", "Workshop"].map((event: any) => (
                    <Link to={event} state={{event}}>
                        <Card className="max-w-xs shadow-lg rounded-lg overflow-hidden mx-2">
                            <img src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75" alt={event} className="w-full h-40 object-cover" />
                            <CardContent className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {/* {event.name} */}
                                    {event}
                                </h2>
                                <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                                    {/* {event.description} */}
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default PastEvent