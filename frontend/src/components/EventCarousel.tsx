import { EventItem } from "@/types/clubType";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

interface EventCarouselProps {
  events: EventItem[];
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {

  const activeEventImages = events.map((event) => event.image).filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeEventImages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeEventImages.length) % activeEventImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeEventImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeEventImages.length]);

  if (activeEventImages.length === 0) {
    return <div>No active events with images available.</div>;
  }

  return (
    <div className="relative h-[24rem] overflow-hidden">
      <Carousel orientation="horizontal" className="h-full">
        <CarouselContent
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {activeEventImages.map((image, index) => {
            const event = events[index];
            return (
              <CarouselItem key={index} className="h-[24rem] w-full">
                <div className="relative flex items-center justify-center h-full">
                  <img
                    src={image}
                    alt={`Active Event ${index + 1}`}
                    className="object-contain h-full w-full"
                  />
                  <div className="absolute bottom-4 left-4 text-black dark:text-white">
                    <div className="text-xl font-bold">{event.name}</div>
                    {/* <div className="text-md">{event.clubName}</div> */}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <button
            onClick={handlePrevious}
            className="p-2 bg-black text-white rounded-full"
          >
            <FaAngleLeft />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <button
            onClick={handleNext}
            className="p-2 bg-black text-white rounded-full"
          >
            <FaAngleRight />
          </button>
        </div>
      </Carousel>
    </div>
  );
};

export default EventCarousel;