import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { sendMessage } from "../API/apiServices";
import Loader from "./Loader"; // Assuming you have a Loader component
import useStore from "./store/userProfileStore";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for tracking API call loading
  const { profileData, fetchProfileData } = useStore();

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data if not already present
    }
  }, [profileData, fetchProfileData]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please fill this field.");
      return;
    }

    if (message.length > 500) {
      setError("Message cannot exceed 500 characters.");
      return;
    }

    setError(""); // Clear errors if input is valid
    setLoading(true); // Set loading to true when the API call starts

    try {
      const response = await sendMessage(message); // Call the sendMessage API function
   
      if (response.success) {
        setLoading(false); // Stop loading after API call finishes
        toast.success(response?.message || "Message Sent!");
        setMessage("");
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (err) {
      setLoading(false); // Stop loading if there's an error
      toast.error(err?.message || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="font-sans flex items-center border-b bg-[#0000]">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 text-[#383838] m-4"
              >
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
              <h1 className="font-sans text-[18px] font-extrabold text-[#383838]">
                Contact Support
              </h1>
              <div className="ml-auto relative group mr-5 ">
                <button
                  className="flex items-left"
                  onClick={() => navigate("/profile")}
                >
                  {profileData?.image ? (
                    <img
                      src={profileData?.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full bg-[#000000]"
                    />
                  ) : (
                    <FaUser size={25} className="text-[#383838]" />
                  )}
                </button>
                <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Profile
                </span>
              </div>
            </div>

            <div className="p-4 text-left">
              <p className="font-sans text-[#646464] mb-4 font-bold text-[15px]">
                We are here to help you. Please fill out the form below to
                contact our support team.
              </p>

              {/* Message Textarea */}
              <div className="mt-4">
                <label
                  htmlFor="message"
                  className="mb-3 block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px]"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError(""); // Clear error when user starts typing
                  }}
                  className={`font-sans w-full px-3 py-2 border ${
                    error ? "border-red-500" : "border-[#E5E5E5]"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800`}
                  rows="5"
                  placeholder="Type your message here..."
                  maxLength={500}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !message.trim()} // Disable button when loading or input is empty
                  className={`w-full font-sans py-3 text-[16px] font-semibold rounded-md flex justify-center items-center ${
                    loading || !message.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#5EB66E] text-white hover:bg-[#469F5E]"
                  }`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default ContactSupport;
