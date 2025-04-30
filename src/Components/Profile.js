import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import { FaUser } from "react-icons/fa";
import CloseIcon from '@mui/icons-material/Close';
// Imported icons
import Edit from "../assets/images/material-symbols_edit.png";
import bankDetails from "../assets/images/BankDetails.png";
import Settings from "../assets/images/Vector (1).png";
import Notification from "../assets/images/Vector (2).png";
import changePass from "../assets/images/change Password.png";
import KYC from "../assets/images/KYC.png"
import FAQ from "../assets/images/headphones.png";
import TC from "../assets/images/Vector (5).png";
// import contact from "../assets/images/Vector (6).png";
import logout from "../assets/images/Vector (7).png";
import arrow from "../assets/images/Vector (8).png";
import plusProfile from "../assets/images/plusProfile.png";
import useAccountStore from './store/useAccountStore';
import contact from "../assets/images/ph_address-book-light.png";
import LoanHistory from "../assets/images/LOAN history.png"

import { updateUserPassword, updateUserProfile,getUserProfile } from "../API/apiServices";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import eye icons
import {
  Box,
  IconButton,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import useStore from "./store/userProfileStore"; 

const Profile = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const { accountData, setAccountData} = useAccountStore();
  const { profileData, setProfileData } = useStore();
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [userProfileEditopen, setuserProfileEditOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  // const [profileData, setProfileData] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(""); // change
  const [otp, setOtp] = useState(""); // change
  const [apicall, setApiCall] = useState(false); // change
  
  const [showOtpField, setShowOtpField] = useState(false); // change
  const [showPasswords, setShowPasswords] = useState({ // Add these State
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => { // Add these function
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchProfileData = async () => {
    try {
      const response = await getUserProfile();


      setProfileData(response.data);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setEmail(response.data.email);
      setImage(response.data.image); // Update image URL or handle it based on your UI design
    } catch (error) {
      toast.error("Failed to fetch profile data");
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [apicall]); // Empty dependency array to run this once on component mount
 
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
        // Clear local storage
        localStorage.clear();
        setAccountData([]);

        setIsAuthenticated(false);
        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        );

        // Navigate to the home page
        setTimeout(() => {
        
         
          navigate("/");
        }, 2000);
      }
    });
  };

  const handleOpen = () => setuserProfileEditOpen(true);
  const handleClose = () => {
    setuserProfileEditOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setUploadedFileName(file?.name);
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    // Check if user has made any changes
    if (
      firstName === profileData?.firstName &&
      lastName === profileData?.lastName &&
      email === profileData?.email &&
      image === profileData?.image
    ) {
      // Show an error toast indicating no changes were made
      toast.error("No changes detected to save!");
      return; // Exit the function without making an API call
    }

    try {
      // Create a FormData object for API call
      // const formData = new FormData();
      // formData.append("firstName", firstName);
      // formData.append("lastName", lastName);
      // formData.append("email", email);
      // if (image) formData.append("image", image);

      // Call the API to update the user profile
      const result = await updateUserProfile({
        firstName,
        lastName,
        email,
        otp,
        image,
      });

     // Handle response
      if (result.message === "OTP sent successfully to your email. Please verify to proceed.") {
        setShowOtpField(true);
        toast.info(result.message);
        return;
      }
      if (result.message === "Profile updated successfully.") {
        setApiCall(true);
        toast.success(result.message);
        setTimeout(() => {
          setuserProfileEditOpen(false);
        }, 2000);
      } else {
        toast.info(result.message);
      }
    } catch (error) {
      // Handle and display API errors
      toast.error(error?.message || "Something went wrong!");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    try {
      // Validate input fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All fields are required. Please fill out every field.");
        return;
      }

      // Check if the new password matches the confirm password
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      // Call the `updateUserPassword` function
      const response = await updateUserPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Handle success response
      toast.success(response.message || "Password updated successfully!");
      setTimeout(() => {
        setChangePasswordModalOpen(false);
      }, 2000); // Wait for 2 seconds before closing the modal

    } catch (error) {
      // Handle error response
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update password. Please try again.";
      toast.error(errorMsg);
    }
  };



  return (
    <>
    <div className="flex justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col">
        {/* {/ Header /} */}
        <div className="flex items-center border-b-4 border-[#E5E5E5] py-4 px-4">
          <button onClick={() => navigate(-1)} className="text-[#383838]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="font-sans text-[18px] font-extrabold text-[#383838] ml-3">
            Profile
          </h1>
        </div>

        {/* {/ Profile Info /} */}
        <div className="flex items-center px-4 pt-3 relative">
          <div className="relative">
          {profileData?.image ? <img src={profileData?.image} alt="Profile" className="w-16 h-16 rounded-full bg-[#000000]" /> : <FaUser size={40} className="text-[#383838]" />}
          </div>
          <div className="ml-4">  
            <h2 className="text-[17px] font-semibold text-[#383838]">{profileData?.firstName}{profileData?.lastName}</h2>
            <p className="text-[14px] font-normal mailto:text-[#383838]">{profileData?.email}</p>
          </div>
          <img src={Edit} alt="Edit" onClick={handleOpen} className="absolute top-2 right-2 w-4 h-4 cursor-pointer" />
        </div>

        {/* {/ Menu Options /} */}
        <div>
          <MenuItem
            icon={bankDetails}
            label="Bank Details"
            isBank
            onClick={() => navigate("/bank-details")}
          />
         <MenuItem
            icon={KYC}
            label="KYC Profile"
            onClick={() => navigate("/kyc-profile")}
          />
          <MenuItem
            icon={LoanHistory}
            label="Loan History"
            onClick={() => navigate("/loan-history")}
          />
          <MenuItem
            icon={changePass}
            label="Change Password"
            onClick={() => setChangePasswordModalOpen(true)}
          />
          <MenuItem icon={FAQ} label="FAQ's" onClick={() => navigate("/faq")} />
          <MenuItem
            icon={TC}
            label="Terms & Conditions"
            onClick={() => navigate("/terms-conditions")}
          />
          
          <MenuItem
            icon={contact}
            label="Contact Support"
            onClick={() => navigate("/contact")}
          />
         
          <MenuItem
            icon={logout}
            label="Log Out"
            onClick={handleLogout}
            isLogout
          />
        </div>
      </div>

      {/* {/ Change Password Modal /} */}
      {isChangePasswordModalOpen && (
     
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">Edit Password</h2>
  <IconButton
    onClick={() =>setChangePasswordModalOpen(false)} 
    size="small"
    sx={{ padding: 0 }}
  >
    <CloseIcon />
  </IconButton>
</div>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-1 relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"} // change
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#5EB66E]"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500" //change these element
                     onClick={() => togglePasswordVisibility("currentPassword")}
                >
                  {showPasswords.currentPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </div>
              </div>
              <div className="flex justify-end mb-4"> {/* Add these div element */}
              <button 
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[#5EB66E]  hover:underline text-sm"
                >
                  Forgot Password?
            </button>
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"} // change
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#5EB66E]"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500" //Add these element
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPasswords.newPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </div>
              </div>
              <div className="mb-4 relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"} // change
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#5EB66E]"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer text-gray-500" // Add these element
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPasswords.confirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setChangePasswordModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5EB66E] text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      
    
      )}
      

      <Modal open={userProfileEditopen} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
           <Typography
  variant="h6"
  sx={{
    fontWeight: "bold",
    mb: 4,
    display: "flex",
    alignItems: "center",
    gap: 2, // Space between the image and text
    justifyContent: "space-between", // Ensure the content is spaced between the text and button
  }}
>
  Edit Profile
  <IconButton
   onClick={() => setuserProfileEditOpen(false)}// Handle the button click event as needed
    size="small"
    sx={{ padding: 0 }} // Optional: Remove padding for better alignment
  >
    <CloseIcon />
  </IconButton>
</Typography>

            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            {showOtpField && (
              <TextField
                fullWidth
                label="OTP"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            <Button variant="contained" component="label" sx={{ mb: 1 }}>
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {uploadedFileName && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Selected file: {uploadedFileName}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ width: "45%" }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClose}
                sx={{ width: "45%" }}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </Modal>
    </div>
     <ToastContainer position="top-center" autoClose={2000} />
     </>
  );
};

// MenuItem Component for reusability
const MenuItem = ({ icon, label, onClick, isLogout = false, isBank = false }) => (
  <div
    className={`flex items-center justify-between py-4 px-5 border-[#E5E5E5] cursor-pointer 
      ${isBank ? "border-t-4 border-[#E5E5E5] mt-4" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <img
        src={icon}
        alt={label}
        className={`${isBank ? "w-9 h-9 -ml-2" : "w-6 h-6"}`}
      />
      <p
        className={`text-[17px] ml-4 font-sans
  ${isLogout ? "text-[#5EB66E] font-semibold" : ""} 
  ${
    isBank
      ? "text-[#383838] font-semibold !text-[17px] leading-[24.55px]"
      : "text-[#383838] font-normal"
  }`}
      >
        {label}
      </p>
    </div>
    <img src={arrow} alt="Arrow" className="w-[0.60rem] h-4" />
  </div>
);

export default Profile;
