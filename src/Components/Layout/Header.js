import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import MainLogo from "../../assets/images/main-logo.png";
import { Avatar } from "@mui/material";

const Header = ({ profileData, searchQuery = "", setSearchQuery = () => {} }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce logic to limit search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedQuery);
    }, 200); // Update query after 500ms
    return () => clearTimeout(handler);
  }, [debouncedQuery]);

  // Handle dropdown close when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5EB66E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire("Logged out!", "You have been successfully logged out.", "success");
        navigate("/admin");
      }
    });
  };

  const handleLogoRedirection = () => {
    navigate("/admin/dashboard");
  };
  const handleChangeProfile = () => {
    setDropdownOpen(false);
    navigate("/admin/editprofile");
  };

  const handleRedirect = () => {
    navigate('/admin/contact-record');
  };
  // Show search bar only on the dashboard page
  const showSearchBar = location.pathname.includes("/admin/dashboard");

  return (
    <header className="p-4 bg-white shadow border-b border-gray-300">
      <div className="flex justify-between items-center w-full">
        <img src={MainLogo} alt="Logo" className="w-28" onClick={handleLogoRedirection} />

        {showSearchBar && (
          <div className="w-full md:w-auto flex-grow md:px-8 mt-4 md:mt-0">
            <div className="relative flex items-center">
              <svg
                className="h-5 w-5 absolute left-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10 17a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                value={debouncedQuery}
                onChange={(e) => setDebouncedQuery(e.target.value)}
             placeholder="Search User by Name, Email, or Loan ID"
                className="w-full md:w-[90%] pl-10 pr-5 py-3 rounded-full shadow-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        )}


        <div className="flex items-center">
          <div className="text-right  hidden sm:block">
            <p className="text-[0.96rem] text-gray-600">
              Hello, {profileData?.firstName} {profileData?.lastName}
            </p>
            <p className="font-bold text-sm sm:text-[1.05rem]">
              {profileData?.email}
            </p>
          </div>
          <div
            ref={dropdownRef}
            className="relative flex items-center  cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {profileData?.image ? (
              <img
                src={profileData?.image}
                alt="Profile"
                style={{ width: 80, height: 50, borderRadius: "50%" }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 50,
                  marginTop: 2,
                  height: 50,
                  backgroundColor: "#C4C4C4",
                  mb: 2,
                }}
              >
                {profileData?.firstName?.charAt(0)}
                {profileData?.lastName?.charAt(0)}
              </Avatar>
            )}
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform -ml-2 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>

            {dropdownOpen && (
              <div className="absolute right-0 md:mt-[9rem] mt-[14rem] md:w-[160px] w-[60vw] bg-white border rounded shadow-lg z-10 ">
                <div className="sm:hidden border-b p-4">
                  <p className="text-gray-600">
                   {profileData?.firstName ? `Hello, ${profileData?.firstName} ${profileData?.lastName}` : null} 
                  </p>
                  <p className="font-bold text-gray-800 mt-2">
                    {profileData?.email}
                  </p>
                </div>

                <button
                  onClick={handleChangeProfile}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleRedirect}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Contact Records
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSearchBar && (
        <div className="w-full sm:hidden mt-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search User"
              value={debouncedQuery}
              onChange={(e) => setDebouncedQuery(e.target.value)}
          className="w-full p-3 pl-5 pr-10 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="font-sans absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10 17a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;