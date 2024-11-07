import { useUserStore } from "@/store/useUserStore";
import { useClubStore } from "@/store/useClubStore"; // Import useClubStore
import moment from "moment";
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ChangeUserRole from "./ChangeUserRole";

const AllAdmins = () => {
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        fullname: "",
        email: "",
        contact: null,
        addmission_no: "",
        branch: "",
        admin: false,
        _id: ""
    });
    const [adminUsers, setAdminUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { allUsers, fetchAllUsers } = useUserStore();
    const { allClubs, fetchAllClubs } = useClubStore();

    useEffect(() => {
        const loadData = async () => {
            await fetchAllUsers();
            await fetchAllClubs();
            setLoading(false);
        };
        loadData();
    }, [fetchAllUsers, fetchAllClubs]);

    useEffect(() => {
        if (allUsers) {
            setAdminUsers(allUsers.filter(user => user.admin === true));
        }
    }, [allUsers]);

    // get club name
    const getClubName = (userId: string) => {
        const club = allClubs?.find(club => club.user === userId);
        return club ? club.clubName : "No Club Assigned";
    };

    return (
        <div className="bg-white">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table className="lg:text-base md:text-sm text-xs">
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black dark:bg-white dark:hover:bg-white">
                            <TableHead className="w-[100px] font-bold text-white">S.No.</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Club Name</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Head of Club</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Email</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Contact Number</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Admission Number</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Branch</TableHead>
                            {/* <TableHead className="dark:text-black font-bold text-white">Admin</TableHead> */}
                            <TableHead className="dark:text-black font-bold text-white">Created Date</TableHead>
                            <TableHead className="dark:text-black font-bold text-white">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adminUsers?.map((el, index: number) => (
                            <TableRow key={index} className="dark:bg-black dark:hover:bg-black bg-white hover:bg-white">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-semibold">{getClubName(el?._id)}</TableCell>
                                <TableCell>{el?.fullname}</TableCell>
                                <TableCell>{el?.email}</TableCell>
                                <TableCell>{el?.contact}</TableCell>
                                <TableCell>{el?.addmission_no}</TableCell>
                                <TableCell>{el?.branch}</TableCell>
                                {/* <TableCell>{el?.admin ? "Yes" : "No"}</TableCell> */}
                                <TableCell>{moment(el?.createdAt).format("LL")}</TableCell>
                                <TableCell>
                                    <button
                                        className="bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green dark:hover:bg-[#2E3A52] hover:text-white"
                                        onClick={() => {
                                            setUpdateUserDetails(el);
                                            setOpenUpdateRole(true);
                                        }}
                                    >
                                        <MdModeEdit />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    fullname={updateUserDetails.fullname}
                    email={updateUserDetails.email}
                    admin={updateUserDetails.admin}
                    userId={updateUserDetails._id}
                />
            )}
        </div>
    );
};

export default AllAdmins;
