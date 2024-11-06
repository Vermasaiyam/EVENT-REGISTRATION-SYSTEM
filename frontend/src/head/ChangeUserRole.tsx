import { useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUserStore } from '@/store/useUserStore';

interface ChangeUserRoleProps {
    fullname: string;
    email: string;
    admin: boolean;
    onClose: () => void;
    userId: string;
}

const ChangeUserRole: React.FC<ChangeUserRoleProps> = ({
    fullname,
    email,
    admin,
    onClose,
    userId
}) => {
    const modalRef = useRef<any>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const [userRole, setUserRole] = useState(admin ? "yes" : "no");
    let isAdmin: boolean;

    const handleOnChange = (newRole: string) => {
        setUserRole(newRole);
        isAdmin = userRole === "yes";
    };

    const { updateUsers } = useUserStore();

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50 dark:bg-slate-800 dark:bg-opacity-75">
            <div ref={modalRef} className="mx-auto bg-white dark:bg-gray-900 dark:text-white shadow-md p-4 w-full max-w-sm">
                <button className="block ml-auto" onClick={onClose}>
                    <IoMdClose className="text-black dark:text-white" />
                </button>

                <h1 className="pb-4 text-lg font-medium">Change User Role</h1>
                <p>Name: {fullname}</p>
                <p>Email: {email}</p>

                <div className="flex items-center justify-between my-4">
                    <p>Admin:</p>
                    <Select defaultValue={userRole} onValueChange={handleOnChange}>
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Admin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    className="w-fit mx-auto block py-1 px-3 rounded-full bg-green hover:bg-hoverGreen  text-white"
                    onClick={() => {
                        updateUsers({ userId, email, fullname, userRole });
                        onClose();
                    }}
                >
                    Change Role
                </button>
            </div>
        </div>

    )
}

export default ChangeUserRole