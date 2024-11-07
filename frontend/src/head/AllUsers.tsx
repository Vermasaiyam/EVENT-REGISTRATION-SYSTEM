import { useUserStore } from "@/store/useUserStore"
import moment from 'moment'
import { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ChangeUserRole from "./ChangeUserRole";


const AllUsers = () => {
  const [openUpdateRole, setOpenUpdateRole] = useState(false)
  const [updateUserDetails, setUpdateUserDetails] = useState({
    fullname: "",
    email: "",
    contact: null,
    addmission_no: "",
    branch: "",
    current_year: "",
    admin: false,
    _id: ""
  })

  const { loading, allUsers, fetchAllUsers } = useUserStore();

  useEffect(() => {
    fetchAllUsers();
    console.log(allUsers);
  }, []);

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

  return (
    <div className='bg-white md:mt-4 mt-2'>
      <Table>
        <TableHeader>
          <TableRow className="bg-black hover:bg-black dark:bg-white dark:hover:bg-white">
            <TableHead className="font-bold dark:text-black text-white">S.No.</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Name</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Email</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Contact Number</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Addmission Number</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Branch</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Year</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Admin</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Created Date</TableHead>
            <TableHead className="dark:text-black font-bold text-white">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderSkeletonRows()
          ) : (
            allUsers?.map((el, index) => {
              return (
                <TableRow key={index} className="dark:bg-black dark:hover:bg-black bg-white hover:bg-white">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{el?.fullname}</TableCell>
                  <TableCell>{el?.email}</TableCell>
                  <TableCell>{el?.contact}</TableCell>
                  <TableCell>{el?.addmission_no === "Addmission Number" ? "-" : el.addmission_no}</TableCell>
                  <TableCell>{el?.branch === "Branch" ? "-" : el.branch}</TableCell>
                  <TableCell>{el?.current_year ? el.current_year : '-'}</TableCell>
                  <TableCell>{el?.admin ? "Yes" : "No"}</TableCell>
                  <TableCell>{moment(el?.createdAt).format('LL')}</TableCell>
                  <TableCell>
                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green dark:hover:bg-[#2E3A52] hover:text-white'
                      onClick={() => {
                        setUpdateUserDetails(el)
                        setOpenUpdateRole(true)
                      }}
                    >
                      <MdModeEdit />
                    </button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {
        openUpdateRole &&
        (
          <ChangeUserRole
            onClose={() => setOpenUpdateRole(false)}
            fullname={updateUserDetails.fullname}
            email={updateUserDetails.email}
            admin={updateUserDetails.admin}
            userId={updateUserDetails._id}
          />
        )
      }
    </div>
  )
}

export default AllUsers