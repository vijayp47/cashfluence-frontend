import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle, BiPlus, BiMinus } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import useStore from "./store/userProfileStore";

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0); // Start with the first item open
  const { profileData, fetchProfileData } = useStore();

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data if not already present
    }
  }, [profileData, fetchProfileData]);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center border-b p-4 bg-gray-50">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-700">
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
          <h1 className="font-sans text-lg font-extrabold text-gray-800">
            Frequently Asked Questions
          </h1>
          <div className="ml-auto relative group">
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

        {/* FAQ Content */}
        <div className="p-4 text-left">
          <div className="mt-4">
            {[
              {
                question: "What types of loans do you offer?",
                answer:
                  "We offer personal loans, microloans, and business loans.",
              },
              {
                question: "What are the eligibility requirements?",
                answer:
                  "You must be at least 18 years old and have a steady income.",
              },
              {
                question: "How long does it take to get approved?",
                answer: "Most applications are approved within 24 hours.",
              },
              {
                question: "What are the repayment terms?",
                answer:
                  "Repayment terms vary by loan type, ranging from 3 to 36 months.",
              },
              {
                question: "How can I contact customer support?",
                answer:
                  "You can reach us via email at support@example.com or call us at (123) 456-7890.",
              },
            ].map((item, index) => (
              <div key={index} className="border-b pb-2 mt-4">
                <div
                  className="flex items-center justify-between cursor-pointer py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md"
                  onClick={() => toggleQuestion(index)}
                >
                  <h2 className="font-bold text-gray-800">{item.question}</h2>
                  {openIndex === index ? (
                    <BiMinus size={20} className="text-[#5EB66E]" />
                  ) : (
                    <BiPlus size={20} className="text-[#5EB66E]" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="text-gray-600 mt-2">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
