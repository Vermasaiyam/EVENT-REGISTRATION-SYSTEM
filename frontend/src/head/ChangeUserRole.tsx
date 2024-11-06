import { useState } from 'react'
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

    const [userRole, setUserRole] = useState(admin ? "yes" : "no");
    let isAdmin: boolean;

    const handleOnChange = (newRole: string) => {
        setUserRole(newRole);
        isAdmin = userRole === "yes";
    };

    const { updateUsers } = useUserStore();


    // const updateUserRole = async () => {
    //     const fetchResponse = await fetch(SummaryApi.updateUser.url, {
    //         method: SummaryApi.updateUser.method,
    //         credentials: 'include',
    //         headers: {
    //             "content-type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             userId: userId,
    //             role: userRole
    //         })
    //     })

    //     const responseData = await fetchResponse.json()

    //     if (responseData.success) {
    //         toast.success(responseData.message);
    //         onClose();
    //         callFunc()
    //     }

    //     console.log("role updated", responseData);

    // }

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className="mx-auto bg-white shadow-md p-4 w-full max-w-sm">
                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium '>Change User Role</h1>
                <p>Name: {fullname}</p>
                <p>Email: {email}</p>

                <div className='flex items-center justify-between my-4'>
                    <p>Admin :</p>
                    <Select defaultValue={userRole} onValueChange={handleOnChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Admin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700'
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