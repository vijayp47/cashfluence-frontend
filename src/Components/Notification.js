import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';
import SubmittedNotification from "../assets/images/submitted.png";
import RejectNotification from "../assets/images/reject.png";
import SuccessfulNotification from "../assets/images/successfully.png";

const Notification = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      text: "Your loan application has been submitted successfully.",
      image: SubmittedNotification
    },
    {
      id: 2,
      text: "Your loan application has been approved.",
      image: SuccessfulNotification
    },
    {
      id: 3,
      text: "We're sorry, but your loan application wasn't approved. Check your email for more details.",
      image: RejectNotification
    }
  ];



  return (
    <div className="flex justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="font-sans flex items-center border-b bg-[#0000]">
            <button onClick={() => navigate('/verification')} className="mr-4 text-[#383838] m-4">
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
              Notification
            </h1>
            <div className="ml-auto relative group">
            <button className="flex items-left" onClick={() => navigate('/profile')}>
              <FaUser size={25} className="text-[#383838]" />
            </button>
            <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </div>
          </div>
          

          {/* Notification List */}
          <div className="p-4 mt-1 ">
            {notifications.map((notification,index) => (
                <div className={` ${index !== notifications.length - 1 ? 'border-b-2 border-dotted border-[#E5E5E5]' : ''} `}>
              <div key={notification.id} className="p-4 mt-5  bg-[#F8F8F8] mb-4  ">
                <div className="flex items-center ">
                  <img src={notification.image} alt="Notification Icon" className="w-10 h-10" />
                  <h2 className="text-[#646464] text-[15px] font-bold ml-3 font-sans">
                    {notification.text}
                  </h2>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
