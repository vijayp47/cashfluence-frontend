import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import Header from "../Components/Layout/Header";
import { useNavigate } from "react-router-dom";
import { getAdminProfile } from "../API/apiServices";
const ContactRecord = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData,setProfileData]=useState([]);
  const fetchProfileData = async () => {
    try {
      const response = await getAdminProfile();
      setProfileData(response.data);
    
    } catch (error) {
  
      return error;
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []); 

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Function to fetch users with pagination
  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${BASE_URL}/admin/users?page=${page}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

   

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter user data based on search query
// Filter user data based on search query
const filteredUsers = users.filter((user) => {
  const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
  return (
    fullName.includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
});


  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} profileData={profileData}/>
      <div className="font-sans flex flex-grow">
        {loading ? (
     <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
  <Loader />
</div>

    
      // Display loader while data is loading
        ) : (
            <div className="w-full md:w-full bg-white md:p-12 p-6 shadow-lg rounded-lg">
            <div className="flex flex-row items-center justify-between mb-8">
              <h2 className="text-left text-2xl md:text-4xl font-bold text-gray-800">
                Contact Records
              </h2>
            </div>
          
            {/* User Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-6 py-3 text-left text-[17px] font-extrabold text-gray-800">Name</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-[17px] font-extrabold text-gray-800">Email</th>
                    <th className="border border-gray-200 px-6 py-3 text-left text-[17px] font-extrabold text-gray-800">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-6 py-4 text-[17px] text-gray-700">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-[17px] text-gray-700">
                        {user.email}
                      </td>
                      <td className="border border-gray-200 px-6 py-4 text-[17px] text-gray-700">
                        {user.message}
                      </td>
                    </tr>
                  ))}
                  {/* If no users match the search query */}
                  {!loading && filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="border border-gray-200 px-6 py-4 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          
            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  page === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#5EB66E] text-white hover:bg-green-600"
                }`}
              >
                Previous
              </button>
              <span className="text-lg text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  page === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#5EB66E] text-white hover:bg-green-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          
          
        )}
      </div>
    </div>
  );
};

export default ContactRecord;
