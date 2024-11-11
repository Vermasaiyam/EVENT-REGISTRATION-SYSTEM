import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clubFormSchema, ClubFormSchema } from "@/schema/clubSchema";
import { useClubStore } from "@/store/useClubStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
// "Hackathons", "Workshops", "KT Sessions", "Coding Competitions", "Tech Quizzes"
// "Piyush Pandey", "Amritansh Tripathi", "Shally Agarwal"
const Club = () => {
    const [input, setInput] = useState<ClubFormSchema>({
        clubName: "",
        eventTypes: [],
        coreTeam: [],
        instaHandle: "",
        linkedinHandle: "",
        xHandle: "",
        email: "",
        imageFile: undefined,
    });

    const [errors, setErrors] = useState<Partial<ClubFormSchema>>({});

    const {
        loading,
        club,
        updateClub,
        createClub,
        getClub,
    } = useClubStore();

    // const loading: boolean = false;
    // const club: boolean = true;

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
            formData.append("eventTypes", JSON.stringify(input.eventTypes));
            formData.append("coreTeam", JSON.stringify(input.coreTeam));

            if (input.instaHandle){
                formData.append("instaHandle", input.instaHandle);
            }
            if (input.linkedinHandle){
                formData.append("linkedinHandle", input.linkedinHandle);
            }
            if (input.xHandle){
                formData.append("xHandle", input.xHandle);
            }
            if (input.email){
                formData.append("email", input.email);
            }


            if (input.imageFile) {
                formData.append("imageFile", input.imageFile);
            }

            // api implementation

            if (club) {
                // update
                await updateClub(formData);
            } else {
                // create
                await createClub(formData);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchClub = async () => {
            await getClub();
            if (club) {
                setInput({
                    clubName: club.clubName || "",
                    eventTypes: club.eventTypes
                    ? club.eventTypes.map((event: string) => event)
                    : [],
                    coreTeam: club.coreTeam
                    ? club.coreTeam.map((member: string) => member)
                    : [],
                    instaHandle: club.instaHandle || "",
                    linkedinHandle: club.linkedinHandle || "",
                    xHandle: club.xHandle || "",
                    email: club.email || "",
                    imageFile: undefined,
                });
            };
        }
        fetchClub();
        console.log(club);
        
    }, []);



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
                                <Label>Instagram Handle</Label>
                                <Input
                                    type="text"
                                    name="instaHandle"
                                    value={input.instaHandle}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your Instagram Handle"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.instaHandle}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Linkedin Handle</Label>
                                <Input
                                    type="text"
                                    name="linkedinHandle"
                                    value={input.linkedinHandle}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your Linkedin Handle"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.linkedinHandle}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>X Handle</Label>
                                <Input
                                    type="text"
                                    name="xHandle"
                                    value={input.xHandle}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your X Handle"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.xHandle}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Club Email</Label>
                                <Input
                                    type="text"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your Club Email"
                                />
                                {errors && (
                                    <span className="text-xs text-red-600 font-medium">
                                        {errors.email}
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