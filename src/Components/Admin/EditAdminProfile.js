import React, { useState, useEffect } from "react";
import LeftVector from "../../assets/images/LeftVector.svg";
import EditPencil from "../../assets/images/fluent_edit-12-regular.svg";
import { ToastContainer, toast } from "react-toastify";
import Headers from "../Layout/Header";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  Alert,
  Avatar,
} from "@mui/material";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import {
  updateAdminProfile,
  getAdminProfile,
  updatePassword,
} from "../../API/apiServices"; // Import the getAdminProfile function

const ProfilePage = () => {
  const [open, setOpen] = useState(false); // Modal state
  const [otp, setOtp] = useState(""); // OTP input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null); // Image upload
  const [showOtpField, setShowOtpField] = useState(false); // OTP field toggle
  const [message, setMessage] = useState(""); // Success/Error messages
  const [alertType, setAlertType] = useState("success"); // Alert type
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const navigate = useNavigate();
  const [apiHit, setApiHit] = useState(false);
  // Fetch the profile details on component load
  const [profileData, setProfileData] = useState([]);
  const fetchProfileData = async () => {
    try {
      const response = await getAdminProfile();
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
  }, []); // Empty dependency array to run this once on component mount

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessage(""); // Reset messages on close
  };

  const handlePasswordOpen = () => setPasswordOpen(true);
  const handlePasswordClose = () => {
    setPasswordOpen(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSaveChanges = async () => {
    try {
      // Validate input fields
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        toast.error("All fields are required. Please fill out every field.");
        return;
      }

      // Check if the new password matches the confirm password
      if (newPassword !== confirmNewPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      // Call the `updatePassword` function
      const response = await updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      // Handle success response
      toast.success(response.message || "Password updated successfully!");
      setTimeout(() => {
        setPasswordOpen(false);
      }, 2000); // Wait for 2 seconds before navigating

      setSuccessMessage(""); // Reset any previous error message
    } catch (error) {
      // Handle error response
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update password. Please try again.";
      toast.error(errorMsg);
      setSuccessMessage("");
    }
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

    setApiHit(true); // Indicate API call in progress

    try {
      // Call the API to update the admin profile
      const result = await updateAdminProfile({
        firstName,
        lastName,
        email,
        otp,
        image,
      });

      // Check if OTP verification is required
      if (
        result.message ===
        "OTP sent successfully to your email. Please verify to proceed."
      ) {
        setShowOtpField(true);
        toast.info(result.message); // Inform the user about the OTP requirement
        return; // Exit without closing the modal
      }

      // Update state with the new profile details, if available
      setFirstName(result.data?.firstName || firstName);
      setLastName(result.data?.lastName || lastName);
      setEmail(result.data?.email || email);

      // Show success message
      if (result.message === "Profile updated successfully.") {
        toast.success(result.message);

        // Wait briefly before performing actions post-update
        setTimeout(() => {
          fetchProfileData(); // Refresh the profile data
          setOpen(false); // Close the modal
        }, 2000); // 2-second delay for better user experience
      }
    } catch (error) {
      // Handle and display API errors
      toast.error(error?.message || "Something went wrong!");
    } finally {
      // Reset the API hit state regardless of success or failure
      setApiHit(false);
    }
  };

  return (
    <>
      <Headers profileData={profileData} refreshProfile={fetchProfileData} />
      <Box className="w-[100%] h-[100vh] flex flex-col items-center justify-center sm:px-5 px-2">
        <Card className="border-[#C4C4C4] border-[1px] w-full max-w-[1042px] h-[350px] rounded-lg">
          <CardContent>
            <Typography
              className="w-[100%] flex flex-row justify-between items-center px-8 mt-8"
              variant="h5"
            >
              <div className="flex  justify-between w-full mt-0">
                <div>
                  <p className="font-['Nunito Sans'] text-[36px] font-[800] text-[#383838] h-[100px]">
                    Profile
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  {image ? (
                    <Avatar
                      src={image}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        backgroundColor: "#C4C4C4",
                        mb: 2,
                      }}
                    >
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </Avatar>
                  )}

                  <div
                    onClick={handleOpen}
                    className="border-[#5EB66E] border-[1px] rounded-lg w-[126px] flex items-center justify-center h-[48px] gap-4 mt-2"
                  >
                    <p className="font-['Nunito Sans'] text-[18px] font-[700] text-[#5EB66E] cursor-pointer">
                      Edit
                    </p>
                    <img
                      className="h-[26px] w-[26px]"
                      src={EditPencil}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </Typography>

            <Box>
              <Box
                display="flex"
                flexDirection="column"
                gap={5}
                className="px-8"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="400px"
                  className="-mt-8"
                  flexDirection={{ xs: "column", sm: "row" }}
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography
                      variant="body1"
                      className="text-[#717171] text-[16px] font-[400]"
                    >
                      First Name
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-[#3D3D3D] text-[24px] font-[400]"
                    >
                      {firstName}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography
                      variant="body1"
                      className="text-[#717171] text-[16px] font-[400]"
                    >
                      Last Name
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-[#3D3D3D] text-[24px] font-[400]"
                    >
                      {lastName}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography
                    variant="body1"
                    className="text-[#717171] text-[16px] font-[400]"
                  >
                    Email
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-[#3D3D3D] text-[24px] font-[400]"
                  >
                    {email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card className="border-[#C4C4C4] border-[1px] w-full max-w-[1042px] h-[222px] rounded-lg mt-10">
          <CardContent>
            <Typography
              className="w-[100%] flex flex-row justify-between items-center px-8 mt-8"
              variant="h5"
            >
              <div className="flex gap-4 flex-row items-center">
                <p className="font-['Nunito Sans'] text-[36px] font-[800] text-[#383838]">
                  Password
                </p>
              </div>
              <div>
                <div
                  onClick={handlePasswordOpen}
                  className="border-[#5EB66E] border-[1px] rounded-lg w-[126px] flex items-center justify-center h-[48px] gap-4"
                >
                  <p className="font-['Nunito Sans'] text-[18px] font-[700] text-[#5EB66E] cursor-pointer">
                    Edit
                  </p>{" "}
                  <img className="h-[26px] w-[26px]" src={EditPencil} alt="" />
                </div>
              </div>
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start", // Align items at the start of the column
                gap: 3, // Add spacing between elements
                mt: 4, // Add top margin for spacing
              }}
              className="px-8"
            >
              <Typography
                variant="body1"
                className="text-[#717171] text-[16px] font-[400] font-['Nunito Sans']"
              >
                Password
              </Typography>
              <Typography
                variant="body2"
                className="text-[#3D3D3D] text-[24px] font-[400] font-['Nunito Sans']"
              >
                xxxxxxxxxx
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* 
        {/ Alert Message /} */}
        {message && (
          <Alert severity={alertType} sx={{ marginTop: "16px" }}>
            {message}
          </Alert>
        )}

        {/* {/ Modal for Editing /} */}
        <Modal open={open} onClose={handleClose}>
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
              }}
            >
              {/* <img
                src={LeftVector} // Replace with your actual image path
                alt="Left Vector"
                style={{ width: "14px", height: "24px" }} // Adjust size as needed
              /> */}
              Edit Profile
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
      </Box>
      <Modal open={passwordOpen} onClose={handlePasswordClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "12px",
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
            }}
          >
            {/* <img
              src={LeftVector} // Replace with your actual image path
              alt="Left Vector"
              style={{ width: "14px", height: "24px" }} // Adjust size as needed
            /> */}
            Edit Password
          </Typography>

          <div style={{ position: "relative", width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Enter current password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                position: "absolute",
                top: "40%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C4C4C4",
              }}
            >
              {showCurrentPassword ? (
                <IoEyeOffOutline size={25} />
              ) : (
                <IoEyeOutline size={25} />
              )}
            </button>
            <button
              type="button"
              className="text-[#5EB66E]   hover:underline -mt-4 w-[100%] flex justify-end mb-2"
              onClick={() => navigate("/admin/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Enter new password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: "absolute",
                top: "40%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C4C4C4",
              }}
            >
              {showNewPassword ? (
                <IoEyeOffOutline size={25} />
              ) : (
                <IoEyeOutline size={25} />
              )}
            </button>
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Confirm password"
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              style={{
                position: "absolute",
                top: "40%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#C4C4C4",
              }}
            >
              {showConfirmNewPassword ? (
                <IoEyeOffOutline size={25} />
              ) : (
                <IoEyeOutline size={25} />
              )}
            </button>
          </div>

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success" sx={{ mb: 2 }}>
              {successMessage}
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
              variant="outlined"
              color="success"
              sx={{
                width: "45%",
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{
                width: "45%",
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={handlePasswordClose}
            >
              Discard
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default ProfilePage;
