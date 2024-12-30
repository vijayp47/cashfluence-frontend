import React from "react";
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Banner from "../assets/images/Banner.png";
const LoanDetailHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center min-h-screen bg-white font-sans">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full flex flex-col">
        {/* Header */}
        <div
          className="text-white rounded-t-lg p-1 bg-cover bg-center"
          style={{ backgroundImage: `url(${Banner})` }}
        >
        <div className="font-sans flex items-center text-white">
            <button onClick={() => navigate('/verification')} className="mr-4  m-4">
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
            <h1 className="font-sans text-[19px] font-extrabold ">
              Loan Payment
            </h1>
            <div className="ml-auto relative group mr-3">
        
        {/* Tooltip */}
        <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          Logout
        </span>
      </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
          
            <div className="text-white text-xl">
              {/* Logout Icon or Other Action */}
            </div>
          </div>
          <div className="text-center px-4">
            <div className="border-b-[0.2px] border-white ">
            <h2 className="text-[19px] font-semibold mb-1 font-sans">Total Repayment</h2>
            <p className="text-[34px] font-extrabold font-sans mb-3">₹50,000</p>
            </div>
            <p className="py-4  tracking-wide leading-relaxed  text-left">
              <span className="text-white text-[16px] font-sans font-semibold">Condition: </span>
              <span className="font-bold text-[16px] text-white font-sans">Repayment</span>
              <span className="ml-10 text-white text-[16px] font-semibold font-sans">Before Due Date: <span className="font-bold text-[16px] text-white">3 days</span></span>
            </p>
          </div>
        </div>

        {/* Repayment Buttons */}
        <div className="flex flex-col items-center px-6 py-4">
          <button className="bg-[#5EB66E] text-white w-full py-3 rounded-lg text-[17px]  font-bold font-sans mb-4">
            Go to Repay
          </button>
          {/* <button className="border-2 border-[#5EB66E] text-[#5EB66E] w-full py-3 rounded-lg text-[17px]  font-bold font-sans">
            Defer The Repayment
          </button> */}
        </div>

        {/* Loan Details Section */}
        <div className="bg-[#F8F8F8] p-6 rounded-lg shadow-lg mx-6 mb-6 border border-[#F8F8F8]">
  {/* Bank Name */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Bank Name</p>
    <p>Opop Bank</p>
  </div>
 

  {/* Bank Account */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Bank Account</p>
    <p>52589845566559623</p>
  </div>
  {/* Border after 4th item */}
  <div className="border-b border-[#E5E5E5] mb-4"></div>

  {/* Product Name */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Product Name</p>
    <p>Jasmine Loan</p>
  </div>

  {/* Loan Amount */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Loan Amount</p>
    <p>₹1000</p>
  </div>

  {/* Loan Term */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Loan Term</p>
    <p>20 Days</p>
  </div>

  {/* Due Date */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Due Date</p>
    <p>Feb 30, 2025</p>
  </div>
  {/* Border after 4th item */}
  <div className="border-b border-[#E5E5E5] mb-4"></div>

  {/* Service Fee */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Service Fee</p>
    <p>₹1000</p>
  </div>

  {/* Interest */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Interest</p>
    <p>₹1000</p>
  </div>

  {/* Overdue Fee */}
  <div className="mb-4 flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Overdue Fee</p>
    <p>₹3000</p>
  </div>

  {/* Total Repayment */}
  <div className=" flex justify-between text-[#383838] font-semibold text-[16px]">
    <p>Total Repayment</p>
    <p>₹3000</p>
  </div>
</div>


      </div>
    </div>
  );
};

export default LoanDetailHome;
