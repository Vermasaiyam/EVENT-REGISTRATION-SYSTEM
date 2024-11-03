import { Award, BookText, CalendarFold, Loader2, Mail, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { useUserStore } from "@/store/useUserStore";


const Profile = () => {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = {
        fullname: "Saiyam Verma",
        email: "saiyam.22b1540145@abes.ac.in",
        // roll_no: 2200321540145,
        admission_no: "2022B15401204",
        current_year: "3rd",
        branch: "CSE-DS",
        profilePicture: ""
    }

    // const { user, updateProfile } = useUserStore();

    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        // roll_no: user?.roll_no || "",
        addmission_no: user?.admission_no || "",
        current_year: user?.current_year || "1st",
        branch: user?.branch || "",
        profilePicture: user?.profilePicture || "",
    });

    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData.profilePicture || "");

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };


    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // convert into dataURI
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result);
                setProfileData((prevData) => ({
                    ...prevData,
                    profilePicture: result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const updateProfileHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // api


    };

    return (
        <form className="max-w-7xl md:mx-auto my-5 mx-4" onSubmit={updateProfileHandler}>
            <div className="flex md:flex-row flex-col md:items-center md:justify-between mx-4">
                <div className="flex items-center gap-2">
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback>SV</AvatarFallback>
                        <input
                            ref={imageRef}
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={fileChangeHandler}
                        />
                        <div
                            onClick={() => imageRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input
                        type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler}
                        className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
                    />
                </div>
                <div className="hover:underline md:text-end text-right md:text-base text-sm hover:text-blue-500 text-gray-700 dark:text-yellow-50">
                    <Link to={'/reset-password'}>Reset Password</Link>
                </div>
            </div>
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10 mx-4">
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-[#2E3A52]">
                    <Mail className="text-gray-500 dark:text-white" />
                    <div className="w-full">
                        <Label>Email</Label>
                        <input
                            disabled
                            name="email"
                            value={profileData.email}
                            onChange={changeHandler}
                            className="w-full text-gray-500 dark:text-gray-300 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-[#2E3A52]">
                    <Award className="text-gray-500 dark:text-white" />
                    <div className="w-full">
                        <Label>Addmission Number</Label>
                        <input
                            name="addmission_no"
                            value={profileData.addmission_no}
                            onChange={changeHandler}
                            className="w-full text-gray-600  dark:text-white bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-[#2E3A52]">
                    <CalendarFold className="text-gray-500 dark:text-white" />
                    <div className="w-full">
                        <Label>Current Year</Label>
                        <Select
                            onValueChange={(newYear) => setProfileData({ ...profileData, current_year: newYear })}
                            defaultValue={profileData.current_year}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Event Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {["1st","2nd","3rd","4th"].map((year: string, index: number) => (
                                        <SelectItem key={index} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200 dark:bg-[#2E3A52]">
                    <BookText className="text-gray-500 dark:text-white" />
                    <div className="w-full">
                        <Label>Branch</Label>
                        <input
                            name="branch"
                            value={profileData.branch}
                            onChange={changeHandler}
                            className="w-full text-gray-600  dark:text-white bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
            </div>
            <div className="text-center">
                {isLoading ? (
                    <Button disabled className="bg-green hover:bg-hoverGreen">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    // <Button type="submit" onClick={updateProfile} className="bg-green hover:bg-hoverGreen  dark:text-white">Update</Button>
                    <Button type="submit" className="bg-green hover:bg-hoverGreen  dark:text-white">Update</Button>
                )}
            </div>
        </form>
    )
}

export default Profile