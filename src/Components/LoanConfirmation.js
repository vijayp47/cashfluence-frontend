import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from "../assets/images/logo.jpg";
import Loader from "../Components/Loader";
import { fetchLoanStatus } from '../API/apiServices';

const LoanConfirmation = () => {
  const { state } = useLocation();  // Get the state passed from navigate
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const loanId = state?.loanId;  // Extract loanId from state

  useEffect(() => {
    const id = localStorage.getItem("loanId");
    const getLoanStatus = async (loanId) => {
      setLoading(true);
      try {
        const loanStatus = await fetchLoanStatus(id);  // Call the API service function
        setStatus(loanStatus);  // Update state with loan status
      } catch (error) {
        setStatus('Error');  // Handle error by updating status
      } finally {
        setLoading(false);
      }
    };

    getLoanStatus();
  }, [loanId]);

  if (loading) {
    return <Loader />;
  }

  let message;
  let bgColorClass;
  let textColorClass;

  // Set message, background color, and text color based on loan status
  switch (status) {
    case 'Approved':
      message = (
        <>
          <h1 className="font-sans text-2xl font-bold mb-2">Loan Approved!</h1>
          <p className="font-sans text-[15px]">🎉 *Congratulations—You're Approved!* 🎉  
Your funds are on the way, and you're officially one step closer to achieving your influencer dreams. Let's do amazing things together!
</p>
        </>
      );
      bgColorClass = 'bg-green-50'; // Green background for approved
      textColorClass = 'text-[#5EB66E]'; // Green text for approved
      break;

    case 'Rejected':
      message = (
        <>
          <h1 className="font-sans text-2xl font-bold mb-2 text-red-500">Loan Rejected</h1>
          <p className="font-sans text-[15px] text-red-500">😕 *We Appreciate Your Application!*  
          Right now, we couldn’t approve your loan—but don't get discouraged! Keep building your profile and try again soon. We're here to help you succeed!</p>
        </>
      );
      bgColorClass = 'bg-red-50'; // Red background for rejected
      textColorClass = 'text-[#DC2626]'; // Red text for rejected
      break;

    case 'Pending':
    default:
      message = (
        <>
          <h1 className="font-sans text-2xl font-bold mb-2 text-yellow-500">Loan Request Submitted!</h1>
          <p className=" text-center font-sans text-[15px] text-yellow-500">⏳ *You're Almost There!* ⏳  <br/>
Your application is currently under review. Sit tight—we’re working quickly behind the scenes. You’ll hear from us soon with good news!
</p>
        </>
      );
      bgColorClass = 'bg-yellow-50'; // Yellow background for pending
      textColorClass = 'text-yellow-500'; // Yellow text for pending
      break;
  }

  return (
    <div className="font-sans flex justify-center items-center min-h-screen bg-gray-100">
      <div className="font-sans bg-white shadow-md w-full max-w-md min-h-screen flex flex-col justify-center items-center">
        <div className="flex justify-center items-center mb-4">
          <img src={Logo} alt="logo" className="w-24 h-24" />
        </div>

        {/* Dynamically set background color and text color based on loan status */}
        <div className={`p-6 rounded-md text-center w-4/5 ${bgColorClass} ${textColorClass}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default LoanConfirmation;
