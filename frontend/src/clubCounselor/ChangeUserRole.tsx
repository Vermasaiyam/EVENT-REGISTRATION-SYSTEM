import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserStore } from '@/store/useUserStore';
import { Club } from '@/types/clubType';

interface ChangeUserRoleProps {
    fullname: string;
    email: string;
    admin: boolean;
    clubCounselor: boolean;
    allClubs: Club[] | any;
    onClose: () => void;
    userId: string;
}

const ChangeUserRole: React.FC<ChangeUserRoleProps> = ({
    fullname,
    email,
    admin,
    clubCounselor,
    allClubs,
    onClose,
    userId
}) => {
    
    const [userClubCounselorRole, setUserClubCounselorRole] = useState(clubCounselor ? "yes" : "no");
    const [counselorsClub, setCounselorsClub] = useState("");
    const [userClubHeadRole, setUserClubHeadRole] = useState(admin ? "yes" : "no");

    // Handle role change
    const handleOnChangeClubHead = (newRole: string) => {
        setUserClubHeadRole(newRole);
    };
    // for club counselor
    const handleOnChangeClubCounselor = (newRole: string) => {
        setUserClubCounselorRole(newRole);
    };
    // for counselors club
    const handleOnChangeCounselorsClub = (club: string) => {
        setCounselorsClub(club);
    };

    // user store
    const { updateUsers } = useUserStore();

    // Function to handle the "Change Role" button click
    const handleChangeRole = () => {
        const isAdmin = userClubHeadRole === "yes";
        const isClubCounselor = userClubCounselorRole === "yes";
        console.log("club - ",counselorsClub);
        

        updateUsers({ userId, email, fullname, isAdmin, isClubCounselor, counselorsClub });
        onClose();
    };

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50 dark:bg-slate-800 dark:bg-opacity-75">
            <div className="mx-auto bg-white dark:bg-gray-900 dark:text-white shadow-md p-4 w-full max-w-sm">
                <button className="block ml-auto" onClick={onClose}>
                    <IoMdClose className="text-black dark:text-white" />
                </button>

                <h1 className="pb-4 text-lg font-medium">Change User Role</h1>
                <p>Name: {fullname}</p>
                <p>Email: {email}</p>

                <div className="flex items-center justify-between my-4">
                    <p>Club Counselor:</p>
                    <Select value={userClubCounselorRole} onValueChange={handleOnChangeClubCounselor}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Club Counselor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {
                    userClubCounselorRole === "yes" && (
                        <div className="">
                            <div className="flex items-center justify-between">
                                <p>Club Name:</p>
                                <Select name='counselorClubName' value={counselorsClub} onValueChange={handleOnChangeCounselorsClub} required>
                                    <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                                        <SelectValue placeholder="Club Counselor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allClubs.map((club: Club) => (
                                            <SelectItem key={club._id} value={club.clubName}>
                                                {club.clubName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>
                            </div>
                            <p className='text-right text-xs text-gray-700 dark:text-gray-400 mt-1'>*For Club Counselors Only</p>
                        </div>
                    )
                }
                <div className="flex items-center justify-between my-4">
                    <p>Club Head:</p>
                    <Select value={userClubHeadRole} onValueChange={handleOnChangeClubHead}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Club Head" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    className="w-fit mx-auto block py-1 px-3 rounded-full bg-green hover:bg-hoverGreen text-white"
                    onClick={handleChangeRole}
                >
                    Change Role
                </button>
            </div>
        </div>
    );
}

export default ChangeUserRole;
