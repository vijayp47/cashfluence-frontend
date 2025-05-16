import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import MainLogo from "../../assets/images/main-logo.png";
import { Avatar } from "@mui/material";
import WeightModal from "../Admin/weightModal";
import {getWeightConfig} from "../../API/apiServices";
import { TbUserEdit } from "react-icons/tb";
import { CiViewList } from "react-icons/ci";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";



const Header = ({
  profileData,
  searchQuery = "",
  setSearchQuery = () => {},
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
 const [weights, setWeights] = useState(null); // Start with null until data is fetched
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Debounce logic to limit search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(debouncedQuery);
    }, 200); // Update query after 500ms
    return () => clearTimeout(handler);
  }, [debouncedQuery]);

   useEffect(() => {
      const fetchWeights = async () => {
        try {
          const { influencerWeights, rateWeights } = await getWeightConfig();
    setWeights({
            influencer_engagementRate: influencerWeights.engagementRate,
            influencer_incomeConsistency: influencerWeights.incomeConsistency,
            influencer_platformDiversity: influencerWeights.platformDiversity,
            influencer_contentQuality: influencerWeights.contentQuality,
            rate_paymentHistory: rateWeights.paymentHistory,
            rate_influencerScore: rateWeights.influencerScore,
          });
          
        } catch (error) {
          console.error("Error fetching weights:", error);
        }
      };
    
      fetchWeights();
    }, []);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        );
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

  const handleGraph = () => {
   
    navigate("/admin/visual-representation");
  };

  const handleRedirect = () => {
    navigate("/admin/contact-record");
  };
  // Show search bar only on the dashboard page
  const showSearchBar = location.pathname.includes("/admin/dashboard");

  return (
    <header className="p-4 bg-white shadow border-b border-gray-300">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <img
          src={MainLogo}
          alt="Logo"
          className="w-28"
          onClick={handleLogoRedirection}
        />

        {/* Search Bar */}
        {showSearchBar && (
          <div className="w-full md:w-auto flex-grow md:px-8 mt-4 md:mt-0  hidden md:block">
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
          <div className="text-right mr-1 hidden sm:block">
            <p className="text-[0.96rem] text-gray-600">
              Hello, {profileData?.firstName} {profileData?.lastName}
            </p>
            <p className="font-bold text-sm sm:text-[1.05rem]">
              {profileData?.email}
            </p>
          </div>

          {/* Profile Image + Dropdown */}
          <div
            ref={dropdownRef}
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Profile Image */}
            {profileData?.image ? (
              <img
                src={profileData?.image}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#C4C4C4",
                }}
              >
                {profileData?.firstName?.charAt(0)}
                {profileData?.lastName?.charAt(0)}
              </Avatar>
            )}

            {/* Dropdown Arrow */}
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>

            {/* Dropdown Menu */}
            {dropdownOpen && (
  <div className="absolute right-0 top-full mt-3 w-[220px] max-w-[90vw] bg-white border rounded shadow-lg z-10">
    {/* Greeting and Email for Small Devices */}
    <div className="sm:hidden border-b p-4 break-words">
      <p className="text-gray-600 truncate">
        {profileData?.firstName
          ? `Hello, ${profileData?.firstName} ${profileData?.lastName}`
          : "Hello, Admin"}
      </p>
      <p className="font-bold text-gray-800 mt-2 truncate">
        {profileData?.email}
      </p>
    </div>

    <button
      onClick={handleGraph}
      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
    >
      <BsGraphUpArrow />
      Visual representation
    </button>

    <button
      onClick={handleChangeProfile}
      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
    >
      <TbUserEdit />
      Edit Profile
    </button>

    <button
      onClick={handleRedirect}
      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
    >
      <CiViewList />
      Contact Records
    </button>

    <button onClick={openModal} className="flex items-start gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
  <IoSettingsOutline size={26} />
  <span>Manage Influencer Score Weights</span>
</button>


    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
    >
      <AiOutlineLogout />
      Logout
    </button>
  </div>
)}

          </div>
        </div>
      </div>

      <WeightModal
                        isOpen={isModalOpen}
                        closeModal={closeModal}
                        weights={weights}
                        setWeights={setWeights}
                      />
      {/* {/ Search Bar for Mobile /} */}
      {showSearchBar && (
        <div className="w-full sm:hidden mt-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search User by Name, Email, or Loan ID"
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
