import { useUserStore } from "@/store/useUserStore";
import moment from 'moment';
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
import { useClubStore } from "@/store/useClubStore";

const CounselorUsers = () => {

  const {user} = useUserStore();

  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    fullname: "",
    email: "",
    contact: null,
    addmission_no: "",
    branch: "",
    current_year: "",
    clubMember: false,
    membersClubName: "",
    clubCounselor: false,
    _id: ""
  });

  const [loading, setLoading] = useState(true);

  const { allUsers, fetchAllUsers } = useUserStore();
  const { allClubs, fetchAllClubs } = useClubStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      await fetchAllUsers();
      await fetchAllClubs();
      setLoading(false);
    };
    loadData();
  }, [fetchAllUsers, fetchAllClubs]);

  const totalPages = Math.ceil((allUsers?.length || 0) / entriesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when entries per page change
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse dark:bg-black bg-white">
        {Array.from({ length: 9 }).map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-full"></div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const paginatedUsers = (allUsers || []).slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className='md:mt-4 mt-2'>
      <div className="flex justify-end items-center mb-4 mx-2">
        <label className="text-sm">
          Show
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="mx-2 p-1 border rounded dark:bg-gray-600"
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          entries
        </label>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-black hover:bg-black dark:bg-white dark:hover:bg-white">
            <TableHead className="font-bold dark:text-black text-white">S.No.</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Name</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Email</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Contact Number</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Admission Number</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Branch</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Year</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Club Head</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Club Member</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Created Date</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderSkeletonRows()
          ) : (
            paginatedUsers?.map((el, index) => (
              <TableRow key={index} className="dark:bg-black dark:hover:bg-black bg-white hover:bg-white">
                <TableCell className="font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</TableCell>
                <TableCell>{el?.fullname}</TableCell>
                <TableCell>{el?.email}</TableCell>
                <TableCell>{el?.contact}</TableCell>
                <TableCell>{el?.addmission_no === "Addmission Number" ? "-" : el.addmission_no}</TableCell>
                <TableCell>{el?.branch === "Branch" ? "-" : el.branch}</TableCell>
                <TableCell>{el?.current_year ? el.current_year : '-'}</TableCell>
                <TableCell>{el?.admin ? "Yes" : "No"}</TableCell>
                <TableCell>{el?.membersClubName === user?.counselorClubName  ? "Yes" : "No"}</TableCell>
                <TableCell>{moment(el?.createdAt).format('LL')}</TableCell>
                <TableCell>
                  <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green dark:hover:bg-[#2E3A52] hover:text-white'
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
        allUsers?.length === 0 && (
          <p className="w-full flex items-center justify-center my-8">No Users found.</p>
        )
      }

      <div className="flex overflow-y-scroll justify-center my-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-4 py-2 text-sm rounded-md ${currentPage === page ? 'bg-green text-white' : 'bg-gray-200 text-gray-700'} hover:bg-hoverGreen`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-300 disabled:bg-gray-300"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          fullname={updateUserDetails.fullname}
          email={updateUserDetails.email}
          clubMember={updateUserDetails.clubMember && updateUserDetails?.membersClubName === user?.counselorClubName}
          clubCounselor={updateUserDetails.clubCounselor}
          allClubs={allClubs}
          userId={updateUserDetails._id}
        />
      )}
    </div>
  );
};

export default CounselorUsers;