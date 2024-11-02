// import { Button } from "@chakra-ui/icons"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
// import HelpingSection from "./HelpingSection";
import Typed from 'typed.js';

const LandingPage = () => {
    const [searchText, setSearchText] = useState<string>("");
    const navigate = useNavigate();

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
            <div className="flex flex-col md:flex-row max-w-8xl lg:mx-20 md:mx-12 mx-4 py-4 px-6 bg-lightGreen dark:bg-[#2E3A52] md:p-10 rounded-lg items-center justify-around m-4 gap-20 box-border">
                <div className="flex flex-1 flex-col lg:gap-10 md:gap-7 gap-5 md:w-[40%]">
                    <div className="flex flex-col md:gap-5 gap-2">
                        <h1 className="md:font-bold font-bold lg:leading-none md:leading-tight lg:font-extrabold md:text-5xl text-4xl">
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
                            placeholder="Search events by its name or club name."
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-10 shadow-lg"
                            onKeyDown={(e) => keyDown(e)}
                        />
                        <Search className="text-gray-500 absolute inset-y-2 left-2" />

                        <Button onClick={() => navigate(`/search/${searchText}`)} className="px-2 md:py-1 py-1 md:text-base text-sm text-white shadow-lg bg-green hover:bg-hoverGreen rounded-sm">Search</Button>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src="bg.png"
                        alt="Background Image"
                        className="object-fit lg:max-h-[550px] lg:min-h-[450px] md:max-h-[450px] md:min-h-[350px] max-h-[350px] min-h-[280px]"
                    />
                </div>
            </div>
            {/* <HelpingSection /> */}
        </div>
    )
}

export default LandingPage