import React, { useEffect, useState } from 'react';
import Loader from "../Loader";
import Swal from 'sweetalert2';
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Function to fetch users with pagination
  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/users?page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log("data...", data.users)
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch users:', data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter user data based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle card click (navigate to user details)
  const handleCardClick = (userId) => {
    // console.log("userId at userList", userId)
    navigate(`/user/${userId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="font-sans flex flex-grow">
        {loading ? (
          <Loader /> // Display loader while data is loading
        ) : (
          <div className="w-full md:w-full bg-[#ffff] p-12">
            <div className="font-sans flex flex-row items-center justify-between mb-6">
              <h2 className="text-left text-xl md:text-[32px] font-bold font-sans">
                User Management
              </h2>
            </div>

            {/* User Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <>
                <div
                  key={user.id}
                  className="bg-[#F8F8F8] p-6 rounded-lg shadow border border-[#E5E5E5] min-h-[150px] cursor-pointer"
                  onClick={() => handleCardClick(user.id)}
                >
                  <div className="font-sans flex justify-between">
                    <div className="flex flex-col text-left">
                      <h3 className="font-sans text-lg font-semibold mb-1">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="font-sans text-gray-600 mb-1">{user.email}</p>
                      <p className="font-sans text-gray-800 mb-1">
                        Loans: {user.loans.length}
                      </p>
                    </div>
               
                  </div>
           
                </div>
                       <div className="flex flex-col space-y-2 justify-end ">
                       {/* Display the number of pending loans */}
                       <span className="font-sans border-2 border-black font-bold text-black py-1 px-4 rounded-lg">
                       {user?.loans && user.loans.length > 0
                          ? user.loans.some((loan) => loan.status === "Pending")
                            ? "Pending Loans"  // Show this if there's any loan with status "Pending"
                            : "No pending Loans"  // Show this if there are loans with status "Approved" or "Rejected"
                          : "No Loans"} 
                       </span>
                     </div></>
              ))}
            </div>

            {/* If no users match the search query */}
            {!loading && filteredUsers.length === 0 && (
              <p className="text-center text-gray-500">No users found.</p>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-center mt-6 space-x-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5EB66E] text-white hover:bg-green-600'
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
                  page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5EB66E] text-white hover:bg-green-600'
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

export default UserList;
