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

interface ChangeUserRoleProps {
    fullname: string;
    email: string;
    adminCount: number;
    clubMember: boolean;
    clubHead: boolean;
    clubName: string | undefined;
    onClose: () => void;
    userId: string;
}

const ChangeUserRole: React.FC<ChangeUserRoleProps> = ({
    fullname,
    email,
    adminCount,
    clubMember,
    clubHead,
    clubName,
    onClose,
    userId
}) => {

    const [userClubMemberRole, setUserClubMemberRole] = useState(clubMember ? "yes" : "no");
    const [userClubHeadRole, setUserClubHeadRole] = useState(clubHead ? "yes" : "no");

    // Handle role change
    const handleOnChangeClubMember = (newRole: string) => {
        setUserClubMemberRole(newRole);
    };
    // Handle role change
    const handleOnChangeClubHead = (newRole: string) => {
        setUserClubHeadRole(newRole);
    };

    // user store
    const { updateMembers, updateUsers } = useUserStore();

    // Function to handle the "Change Role" button click
    const handleChangeRole = () => {
        const isMember = userClubMemberRole === "yes";

        const isAdmin = userClubHeadRole === "yes";

        updateUsers({ userId, email, fullname, isAdmin });

        if (isMember) {
            updateMembers({ userId, email, fullname, isMember, membersClubName: clubName, clubName });
        }
        else {
            updateMembers({ userId, email, fullname, isMember, clubName });
        }
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
                    <p>Club Head:</p>
                    <Select value={userClubHeadRole} onValueChange={handleOnChangeClubHead}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Club Head" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="yes"
                                disabled={adminCount === 1 && userClubHeadRole === "no"}
                            >
                                Yes
                            </SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between my-4">
                    <p>Club Member:</p>
                    <Select value={userClubMemberRole} onValueChange={handleOnChangeClubMember}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Club Member" />
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
