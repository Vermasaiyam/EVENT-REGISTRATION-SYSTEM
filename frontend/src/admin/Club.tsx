import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clubFormSchema, ClubFormSchema } from "@/schema/clubSchema";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const Club = () => {
    const [input, setInput] = useState<ClubFormSchema>({
        clubName: "DataVerse",
        eventTypes: ["Hackathons", "Workshops", "KT Sessions", "Coding Competitions", "Tech Quizzes"],
        coreTeam: ["Piyush Pandey", "Amritansh Tripathi", "Shally Agarwal"],
        imageFile: undefined,
    });

    const [errors, setErrors] = useState<Partial<ClubFormSchema>>({});

    const loading: boolean = false;
    const club: boolean = true;

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = clubFormSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<ClubFormSchema>);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("clubName", input.clubName);
            formData.append("fieldOfEvents", JSON.stringify(input.eventTypes));
            formData.append("coreTeam", JSON.stringify(input.coreTeam));

            if (input.imageFile) {
                formData.append("imageFile", input.imageFile);
            }

            // api implementation

        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     const fetchClub = async () => {
    //         if (club) {
    //             setInput({
    //                 clubName: club.clubName || "",
    //                 fieldOfEvents: club.fieldOfEvents
    //                     ? club.fieldOfEvents.map((event: string) => event)
    //                     : [],
    //                 coreTeam: club.coreTeam
    //                     ? club.coreTeam.map((member: string) => member)
    //                     : [],
    //                 imageFile: undefined,
    //             });
    //         };
    //     }
    //     fetchClub();
    // }, []);



    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="mx-2">
                <div>
                    <h1 className="font-extrabold text-center md:text-3xl text-2xl mb-5">
                        {
                            club
                                ? "Update Your Club"
                                : "Add Your Club"
                        }
                    </h1>
                    <form onSubmit={submitHandler}>
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            <div>
                                <Label>Club/Society Name</Label>
                                <Input
                                    type="text"
                                    name="clubName"
                                    value={input.clubName}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your Club Name"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.clubName}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Event Types</Label>
                                <Input
                                    type="text"
                                    name="eventTypes"
                                    value={input.eventTypes}
                                    onChange={(e) =>
                                        setInput({ ...input, eventTypes: e.target.value.split(",") })
                                    }
                                    placeholder="E.g. Hackathones, Quizzes"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.eventTypes}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Core Team</Label>
                                <Input
                                    type="text"
                                    name="coreTeam"
                                    value={input.coreTeam}
                                    onChange={(e) =>
                                        setInput({ ...input, coreTeam: e.target.value.split(",") })
                                    }
                                    placeholder="E.g. John, Jimmy"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.coreTeam}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Upload Club Banner</Label>
                                <Input
                                    onChange={(e) =>
                                        setInput({
                                            ...input,
                                            imageFile: e.target.files?.[0] || undefined,
                                        })
                                    }
                                    type="file"
                                    accept="image/*"
                                    name="imageFile"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.imageFile?.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="my-5 w-full flex items-center justify-center">
                            {loading ? (
                                <Button disabled className="bg-green hover:bg-hoverGreen">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button className="bg-green hover:bg-hoverGreen dark:text-white">
                                    {
                                        club
                                            ? "Update Your Club"
                                            : "Add Your Club"
                                    }
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Club