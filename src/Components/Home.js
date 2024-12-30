import React from "react";
import { useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import plus from "../assets/images/plus.png";
import Notification from "../assets/images/notification.png";
import Polygon1 from "../assets/images/Polygon 5.png";
import Polygon2 from "../assets/images/Polygon 6.png";
import interest from "../assets/images/Interest.png";
import term from "../assets/images/term.png";
import Reactangle from "../assets/images/Rectangle.png";

const Home = () => {
  const navigate = useNavigate();

  const loans = [
    {
      id: 1,
      name: "Personal Loan",
      accountNo: "701543964",
      amount: 1500,
      status: "Partially Paid",
    },
    {
      id: 2,
      name: "Car Loan",
      accountNo: "701543965",
      amount: 2000,
      status: "Fully Paid",
    },
    // Add more loans as needed
  ];
 return (
    <div className="flex justify-center min-h-screen relative">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-start relative">
        {/* Header */}
        <div className="md:h-[160px] h-[130px] bg-[#5EB66E] relative">
          <div className="flex flex-col justify-between px-4">
            <div className="flex justify-between items-start">
              {/* Left Section */}
              <div className="flex items-start mt-7">
                <button
                 
                  className="text-white flex items-center space-x-2 whitespace-nowrap"
                >
                  <BiMenu size={26} />
                  <h1 className="text-white font-semibold text-[18px] md:text-[20px]">
                    Hello John
                  </h1>
                </button>
              </div>

              {/* Right Section */}
              <div className="flex items-center relative mt-6 md:mt-7" onClick={() => navigate("/notification")}>
                <img
                  src={Notification}
                  
                  alt="notification"
                  className="h-6 w-6 md:h-7 md:w-7 relative"
                />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  3
                </span>
              </div>
            </div>
            <img
              src={Polygon1}
              alt="polygon1"
              className="absolute bottom-65 right-0 h-16 md:h-20 lg:h-24"
            />
          </div>
          <img
            src={Polygon2}
            alt="polygon2"
            className="absolute bottom-0 left-0 h-16 md:h-20 lg:h-24 ml-10 mt-[-10px] z-10"
          />
        </div>

        {/* White Box (Card) with Higher z-Index */}
        <div className="px-4 -mt-10 md:-mt-12 lg:-mt-16  z-20 relative">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="flex justify-center items-center h-full w-50 ">
              <img src={Reactangle} alt="banner" className="text-center -mt-3 h-[40px]" />
              <div className="absolute text-white font-sans font-semibold text-[16px] -mt-2">
                Maximum Loan Amount
              </div>
            </div>
            <div className="flex justify-center items-center border-b border-[#E5E5E5]">
              <h2 className="text-[32px] font-bold font-sans mt-1 mb-1 text-center items-center">$1500</h2>
            </div>
            <div className="p-4 bg-[#F7FEF8]">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <img src={interest} alt="Interest" />
                  <span className="text-[15px] font-medium text-[#5D5C5D] font-sans">Interest 0.01% p.d.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={term} alt="Term" />
                  <span className="text-[15px] font-medium text-[#5D5C5D] font-sans">Term: 90 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Loans Section */}
        <div className="pl-4 flex-1 z-20 relative">
          <h2 className="text-[24px] font-bold mb-1 mt-6">Your Loans</h2>
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white shadow-lg rounded-lg mb-4">
              <div className="flex justify-between mb-2 border-b border-[#E5E5E5]">
                <h2 className="text-[16px] font-bold p-4">{loan.name}</h2>
              </div>
              <div className="p-4">
                <div className="flex justify-between pl-2 mb-2 border-b-2 border-dotted border-[#E5E5E5]">
                  <span className="text-[#555555] text-[14px] font-semibold mb-2">
                    Account No
                  </span>
                  <span className="font-semibold">{loan.accountNo}</span>
                </div>
                <div className="flex justify-between p-2 mb-3 border-b-2 border-dotted border-[#E5E5E5]">
                  <span className="text-[#555555] text-[14px] font-semibold">
                    Loan Amount
                  </span>
                  <span className="font-semibold">${loan.amount}</span>
                </div>
                <div className="bg-[#5EB66E14] text-[14px] font-bold text-black p-2 py-2 rounded mb-2">
                  {loan.status} Loan
                </div>
                <div className="flex justify-end">
                  <button className="bg-[#5EB66E] mt-1 text-white px-4 py-2 rounded-xl" onClick={() => navigate("/loanDetail")}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="absolute right-4 bottom-4">
          <button onClick={() => navigate("/applyforloan")} className="flex">
            <img src={plus} alt="create loan" className="w-12 h-12" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
