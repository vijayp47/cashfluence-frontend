import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import Swal from 'sweetalert2';
import { FaUser } from "react-icons/fa";
import { getUserLoans } from "../API/apiServices";
import Loader from "./Loader"; 

const TransactionHistory = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setError('User ID not found.');
          setIsLoading(false);
          return;
        }

        const result = await getUserLoans(userId);
        setLoans(result.data);
      } catch (error) {
        
          const customMsg = error?.response?.data?.message || error.message || 'Failed to fetch loans';
          setError(customMsg);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="flex justify-center min-h-screen font-sans">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="font-sans flex items-center border-b bg-[#0000]">
            <button onClick={() => navigate(-1)} className="mr-4 text-[#383838] m-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="font-sans text-[18px] font-extrabold text-[#383838]">Loan History</h1>
            <div className="ml-auto relative group">
              <button className="flex items-left mr-3" onClick={() => navigate('/profile')}>
                <FaUser size={25} className="text-[#383838]" />
              </button>
              <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Profile
              </span>
            </div>
          </div>

          {/* Loader */}
          {isLoading ? (
          
              <Loader />
          
          ) : error ? (
            <div className="flex items-center justify-center min-h-[630px]">
            <p className="text-red-500 text-center">{error}</p>
          </div>
          

          
          ) : (
            <div className="p-4 mt-6">
              {loans.length > 0 ? (
                loans.map((transaction, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg mb-8 border border-[#A4A4A440]"
                    style={{ boxShadow: '0 4px 8px rgba(164, 164, 164, 0.25)' }}
                  >
                    {/* Loan ID & Status */}
                    <div className="flex justify-between items-center border-b border-[#E5E5E5] px-3 p-3">
                      <h2 className="font-bold  text-[18px] text-[#383838]">Loan ID: {transaction.loanId}</h2>
                      <span className="text-[14px] font-semibold px-2 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: transaction.status === "Approved" ? "#D4EDDA" : "#F8D7DA", 
                          color: transaction.status === "Approved" ? "#155724" : "#721C24" 
                        }}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    {/* Loan Details */}
                    <div className="flex justify-between mb-2 px-3 pb-1 mt-3 ">
                      <span className="text-[#5D5C5D] text-[14px] font-semibold">Loan Amount</span>
                      <span className="font-semibold text-[15px] leading-custom tracking-tight">${transaction?.amount}</span>
                    </div>
                    <div className="flex justify-between mb-2 px-3 pb-1 ">
                      <span className="text-[#5D5C5D] text-[14px] font-semibold">Interest Rate</span>
                      <span className="font-semibold text-[15px] leading-custom tracking-tight">{transaction?.interest}%</span>
                    </div>
                    <div className="flex justify-between mb-2 px-3 pb-1 ">
                      <span className="text-[#5D5C5D] text-[14px] font-semibold">Repayment Term</span>
                      <span className="font-semibold text-[15px] leading-custom tracking-tight">
                        {transaction.repaymentTerm / 30} months
                      </span>
                    </div>
                    <div className="flex justify-between mb-2 px-3 pb-1 ">
                      <span className="text-[#5D5C5D] text-[14px] font-semibold">Due Date</span>
                      <span className="font-semibold text-[15px] leading-custom tracking-tight">
                        {transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between px-3 pb-3">
                      <span className="text-[#5D5C5D] text-[14px] font-semibold ">Overdue Status</span>
                      <span className="font-semibold text-[15px] leading-custom tracking-tight">
                        {transaction.overdueStatus || "Not Overdue"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">No transactions found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
