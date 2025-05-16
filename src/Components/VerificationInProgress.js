import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import useStore from "./store/userProfileStore";

const VerificationInProgress = () => {
  const navigate = useNavigate();
  const [rangeValue, setRangeValue] = useState(75);
  const { profileData, fetchProfileData } = useStore();

  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
  };

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data if not already present
    }
  }, [profileData, fetchProfileData]);

  return (
    <div className="flex justify-center  min-h-screen font-sans ">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between ">
        {/* Header */}
        <div>
          <div className="flex items-center  border-b  bg-[#0000]">
            <button
              onClick={() => {
                navigate("/kyc-profile");
              }}
              className="mr-4 text-[#383838] m-4 font-sans"
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
            <h1 className="text-[18px] font-sans font-extrabold text-[#383838] ">
              Verification in Progress
            </h1>
            <div className="ml-auto relative group mr-5">
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

          {/* Credit Check */}
          <div className="p-4 bg-white">
            <p className="font-sans text-[16px] text-[#646464] text-normal text-left mb-4">
              Your credit history looks good. You are eligible for a microloan.
            </p>

            {/* ID Card Upload */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-2"
              >
                ID Card
              </label>

              <input
                type="text"
                id="idCard"
                value="xyz.png"
                disabled
                className="font-sans text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            {/* Live Selfie Upload */}
            <div className="mb-6">
              <label
                htmlFor="liveSelfie"
                className="block text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-2"
              >
                Live Selfie
              </label>

              <input
                type="text"
                id="liveSelfie"
                value="xyz.png"
                disabled
                className="font-sans text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-6 mt- flex items-right">
              <input
                type="range"
                min="0"
                max="100"
                value={rangeValue}
                onChange={handleRangeChange}
                className="w-full h-2 rounded outline-none"
                style={{
                  background: `linear-gradient(to right, #5EB66E ${rangeValue}%, #E5E7EC ${rangeValue}%)`,
                  WebkitAppearance: "none",
                  appearance: "none",
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  height: 30px;
                  width: 30px;
                  border-radius: 50%;
                  background: white; /* White middle circle */
                  border: 4px solid #17cee74d; /* Blue outer border */
                  box-shadow: inset 0 0 0 6px white,
                    /* White inner circle */ inset 0 0 0 12px #5eb66e; /* Larger grey circle */
                }

                input[type="range"]::-moz-range-thumb {
                  height: 30px;
                  width: 30px;
                  border-radius: 50%;
                  background: white; /* White middle circle */
                  border: 4px solid #17cee74d; /* Blue outer border */
                  box-shadow: inset 0 0 0 6px white,
                    /* White inner circle */ inset 0 0 0 12px #5eb66e; /* Larger grey circle */
                }

                /* Focus state with more blue glow */
                input[type="range"]:focus::-webkit-slider-thumb {
                  background: white; /* White middle circle */
                  border: 4px solid #17cee74d; /* Blue outer border */
                  box-shadow: inset 0 0 0 6px white,
                    /* White inner circle */ inset 0 0 0 12px #5eb66e; /* Larger grey circle */
                }

                input[type="range"]:focus::-moz-range-thumb {
                  background: white; /* White middle circle */
                  border: 4px solid #17cee74d; /* Blue outer border */
                  box-shadow: inset 0 0 0 6px white,
                    /* White inner circle */ inset 0 0 0 12px #5eb66e; /* Larger grey circle */
                }
              `}</style>
            </div>

            <p className="font-sans text-[12px] mt-1 text-[#646464] mb-7 text-left">
              You have completed 75% of the profile & KYC verification process.
            </p>

            {/* Compliance Notice */}
            <div className="p-4 font-sans bg-[#5EB66E1A] rounded-lg font-normal text-[16px] text-[#646464] mb-4 text-left">
              ✨ *Let’s Quickly Get You Verified!* ✨ We just need a few details
              to keep everything safe, secure, and super smooth for you.
              Completing KYC helps us protect your account and ensure you're
              ready to unlock funds that fuel your influencer goals.
            </div>
          </div>
        </div>

        {/* Submit Button at Bottom */}
        <div className="p-4">
          <button
            onClick={() => {
              navigate("/bank-details");
            }}
            className=" font-sans w-full bg-[#5EB66E] text-[#ffff] py-3 text-[16px] font-semibold rounded-md hover:bg-[#469F5E] focus:outline-none focus:ring-2 focus:ring-[#5EB66E]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationInProgress;
