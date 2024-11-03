import { useLocation, useParams } from "react-router-dom";

const EventPage = () => {

    const { id } = useParams();
    const location = useLocation();
    const { event } = location.state || {};

    return (
        <div className="max-w-6xl mx-auto my-10 min-h-[60vh]">
            <div className="w-full mx-2">
                <div className="relative w-full h-32 md:h-64 lg:h-72 ">
                    <img
                        // src={singleClub?.imageUrl || "Loading..."}
                        src="https://technovate-2.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fabab2fc5c170491f8277d3ad46a39abc%2Fassets%2Ffavicon%2F761.jpeg&w=1440&q=75"
                        alt="Club Cover Image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-bold text-2xl">
                            {event}
                        </h1>
                        <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">
                            {/* {event.description} */}
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex et perspiciatis cumque impedit similique atque Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus blanditiis dolorum quae, quaerat cupiditate possimus saepe aspernatur perspiciatis obcaecati debitis assumenda omnis harum repellat eius veniam cumque ullam voluptate quidem, atque adipisci molestias expedita consectetur? Perspiciatis ea nemo quisquam temporibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque aliquam officiis sint recusandae id error veniam, nulla nemo fugiat hic.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventPage