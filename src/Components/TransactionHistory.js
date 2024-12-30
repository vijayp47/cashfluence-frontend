import React from "react";
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import Swal from 'sweetalert2';
import { FaUser } from "react-icons/fa";

// Mock transaction data
const transactions = [
  {
    id: "No.002",
    loanAmount: "₹20,000",
    delayDays: "7 days",
    originalDueDate: "Feb 30, 2022",
    deferredDueDate: "Feb 30, 2022",
  },
  {
    id: "No.001",
    loanAmount: "₹20,000",
    delayDays: "7 days",
    originalDueDate: "Feb 30, 2022",
    deferredDueDate: "Feb 30, 2022",
  },
  // Add more transactions as needed
];

const TransactionHistory = () => {
  const navigate = useNavigate();


  return (
    <div className="flex justify-center min-h-screen font-sans">
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
              Transaction History
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

          {/* History List */}
          <div className="p-4 mt-6">
            {transactions.map((transaction, index) => (
          <div 
          key={index} 
          className="bg-white rounded-lg mb-8  border border-[#A4A4A440]"
          style={{ boxShadow: '0 4px 8px rgba(164, 164, 164, 0.25)' }}
        >
                <h2 className="font-bold text-[18px] mb-3 text-[#383838] pb-3 border-b border-[#E5E5E5] px-3 p-3">{transaction.id}</h2>
                <div className="flex justify-between mb-2 px-3 pb-1 ">
                  <span className="text-[#5D5C5D] text-[14px] font-semibold">Loan Amount</span>
                  <span className="font-semibold text-[15px] leading-custom tracking-tight">{transaction.loanAmount}</span>
                </div>
                <div className="flex justify-between mb-2 px-3 pb-1 ">
                  <span className="text-[#5D5C5D] text-[14px] font-semibold">Delay Days</span>
                  <span className="font-semibold text-[15px] leading-custom tracking-tight">{transaction.delayDays}</span>
                </div>
                <div className="flex justify-between mb-2 px-3 pb-1 ">
                  <span className="text-[#5D5C5D] text-[14px] font-semibold">Original Due Date</span>
                  <span className="font-semibold text-[15px] leading-custom tracking-tight">{transaction.originalDueDate}</span>
                </div>
                <div className="flex justify-between px-3 pb-3">
                  <span className="text-[#5D5C5D] text-[14px] font-semibold ">Deferred Due Date</span>
                  <span className="font-semibold text-[15px] leading-custom tracking-tight">{transaction.deferredDueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
