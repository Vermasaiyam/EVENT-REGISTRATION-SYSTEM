import { useUserStore } from "@/store/useUserStore";
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

const AllClubMembers = () => {

    const { user } = useUserStore();

    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({
        fullname: "",
        email: "",
        contact: null,
        addmission_no: "",
        branch: "",
        admin: false,
        clubCounselor: false,
        clubMember: false,
        membersClubName: "",
        _id: ""
    });
    const [myClubUsers, setMyClubUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const { allUsers, fetchAllUsers } = useUserStore();

    const totalPages = Math.ceil(myClubUsers.length / entriesPerPage);

    useEffect(() => {
        const loadData = async () => {
            await fetchAllUsers();
            setLoading(false);
        };
        loadData();
    }, [fetchAllUsers]);

    useEffect(() => {
        if (allUsers) {
            setMyClubUsers(allUsers.filter(u => u.membersClubName === user?.counselorClubName));
        }
    }, [allUsers]);

    // Render skeleton rows during loading
    const renderSkeletonRows = () => {
        return Array.from({ length: entriesPerPage }).map((_, index) => (
            <TableRow key={index} className="animate-pulse dark:bg-black bg-white">
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                        <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-full"></div>
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    // Pagination controls
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    const goToNextPage = () => goToPage(currentPage + 1);
    const goToPreviousPage = () => goToPage(currentPage - 1);

    // Get paginated users
    const paginatedUsers = myClubUsers.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <div className="md:mt-4 mt-2">
            {/* Entries per page selector */}
            <div className="flex justify-end items-center mb-4 mx-2">
                <label className="text-sm">
                    Show
                    <select
                        value={entriesPerPage}
                        onChange={(e) => {
                            setEntriesPerPage(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page on changing entries per page
                        }}
                        className="mx-2 p-1 border rounded dark:bg-gray-600"
                    >
                        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    entries
                </label>
            </div>

            {/* Table displaying admin users */}
            <Table className="lg:text-base md:text-sm text-xs">
                <TableHeader>
                    <TableRow className="bg-black hover:bg-black dark:bg-white dark:hover:bg-white">
                        <TableHead className="font-bold dark:text-black text-white">S.No.</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Club Name</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Club Member</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Club Head</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Email</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Contact Number</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Addmission Number</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Branch</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Year</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Created Date</TableHead>
                        <TableHead className="dark:text-black font-bold text-white">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        renderSkeletonRows()
                    ) : (
                        paginatedUsers.map((el, index) => (
                            <TableRow key={index} className="dark:bg-black dark:hover:bg-black bg-white hover:bg-white">
                                <TableCell className="font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</TableCell>
                                <TableCell className="font-semibold">{el?.membersClubName}</TableCell>
                                <TableCell>{el?.fullname}</TableCell>
                                <TableCell>{(el?.admin && el?.membersClubName === user?.counselorClubName) ? "Yes" : "No"}</TableCell>
                                <TableCell>{el?.email}</TableCell>
                                <TableCell>{el?.contact}</TableCell>
                                <TableCell>{el?.addmission_no === "Addmission Number" ? "-" : el.addmission_no}</TableCell>
                                <TableCell>{el?.branch === "Branch" ? "-" : el.branch}</TableCell>
                                <TableCell>{el?.current_year ? el.current_year : '-'}</TableCell>
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
                        ))
                    )}
                </TableBody>
            </Table>

            {
                myClubUsers.length === 0 && (
                    <p className="w-full flex items-center justify-center my-8">No Club Members found.</p>
                )
            }

            {/* Pagination controls */}
            <div className="flex overflow-y-scroll justify-center my-4 space-x-2">
                <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300">
                    First
                </button>
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300">
                    Previous
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index + 1)}
                        className={`px-4 py-2 text-sm rounded-md ${currentPage === index + 1 ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300">
                    Next
                </button>
                <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300">
                    Last
                </button>
            </div>

            {/* Modal for updating user role */}
            {openUpdateRole && (
                <ChangeUserRole
                    onClose={() => setOpenUpdateRole(false)}
                    fullname={updateUserDetails.fullname}
                    email={updateUserDetails.email}
                    clubMember={updateUserDetails.clubMember && updateUserDetails?.membersClubName === user?.counselorClubName}
                    clubHead={(updateUserDetails?.admin && updateUserDetails?.membersClubName === user?.counselorClubName)}
                    clubName={user?.counselorClubName}
                    userId={updateUserDetails._id}
                />
            )}
        </div>
    );
};

export default AllClubMembers;