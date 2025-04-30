import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import useStore from "./store/userProfileStore";
import { updateTermsAcceptStatus } from "../API/apiServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const legalSections = [
  { title: "Loan Application and Authorization", content: "I am applying for a short- or mid-term personal loan or business loan (if applicable) through a licensed or exempt lender in compliance with applicable federal and state laws. I authorize the lender and its service providers to verify the information provided in this application, including but not limited to credit, banking, and identity verification." },
  { title: "Truthful Information", content: "I affirm that all information I submit is accurate and truthful. I understand that providing false or misleading information may result in denial of the application or cancellation of any existing loan." },
  { title: "Loan Terms and Disclosures", content: "I will receive a Truth in Lending Act (TILA) disclosure outlining the Annual Percentage Rate (APR), loan amount, payment schedule, finance charges, and total repayment obligation prior to signing any final loan agreement.I understand that the loan must be repaid according to the agreed schedule, and failure to do so may result in late fees, collections, or credit reporting where permitted." },
  { title: "Electronic Signature and Communications", content: "I consent to receive all documents, notices, and disclosures electronically and agree to use electronic signatures to execute any agreement or authorization. I confirm that I have access to an email address and internet connection to receive such information." },
  { title: "ACH Authorization (if applicable)", content: "If I provide bank account information for funding or repayment, I authorize the lender to initiate electronic funds transfers (ACH debits or credits) to and from my designated account according to the repayment schedule or as otherwise permitted by the loan agreement." },
  { title: "Governing Law", content: "This loan is subject to the laws of the state in which the borrower resides or the business is registered, except where federal law or contract terms specify otherwise." },
  { title: "Florida Applicants", content: "I acknowledge this loan is offered under the Florida Consumer Finance Act (Chapter 516, Florida Statutes) and is not a payday loan or deferred presentment product.The lender is licensed or exempt from licensing and complies with all applicable interest rate caps, fee limitations, and disclosure requirements under Florida law." },
  { title: "Arbitration Clause (if permitted by applicable law)", content: "I agree that any disputes arising from this loan, except those related to collection efforts or debt recovery, may be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. I understand I am waiving my right to a jury trial." },
  { title: "No Guarantee of Approval", content: "Submission of an application does not guarantee approval. Loan approval is subject to verification of eligibility, creditworthiness, and compliance with applicable laws in the borrower's jurisdiction." },
  { title: "State Limitations", content: " I understand that loan availability, terms, and limits vary by state. Some states may have restrictions that prevent the lender from issuing loans to certain applicants. I acknowledge that if my state does not permit such loans or requires additional disclosures or conditions, the lender will not proceed with funding unless in compliance." },
  { title: "Privacy and Data Use", content: "I authorize the lender and its affiliates to use my information in accordance with their Privacy Policy, which I may review before submission." }
];

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const { profileData, fetchProfileData } = useStore();

  useEffect(() => {
    if (!profileData) fetchProfileData();
  }, [profileData, fetchProfileData]);

  const handleSubmit = async () => {
    setLoading(true); // Start loading indicator

    try {
      // Call the API to update terms acceptance status
      const response = await updateTermsAcceptStatus();
      
      if (response?.success) {
        // Show success Toast message using the message from the backend
        toast.success(response?.message || 'Terms Accepted! You have successfully accepted the terms and conditions.');
        
        // Navigate to the loan application page after success
        navigate('/applyForLoan');
      } else {
        // Show error Toast using the message from the backend if success is false
        toast.error(response?.message || 'There was an issue while accepting the terms. Please try again.');
      }
    } catch (error) {
      console.error("Error updating terms acceptance:", error);
  
      // Show error Toast for unexpected errors, using the message from the backend if available
      toast.error(error?.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md flex flex-col relative">
        {/* Header */}
        <div className="flex items-center border-b p-4 bg-gray-50">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-lg font-extrabold text-gray-800">Terms and Agreement</h1>
          <div className="ml-auto relative group">
            <button onClick={() => navigate('/profile')}>
              {profileData?.image ? (
                <img src={profileData?.image} alt="Profile" className="w-8 h-8 rounded-full bg-black" />
              ) : (
                <FaUser size={25} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4 pb-24">
          <p className="text-gray-700">
            By checking the box below and submitting this application, you confirm that you have read, understood, and agree to the Terms and Conditions.
          </p>

          <label className="flex items-start space-x-2 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <span className="text-sm text-gray-800 -mt-1">
              I agree to the{' '}
              <button className="text-blue-600 underline" onClick={() => setOpen(!open)}>
                Terms and Conditions
              </button>
            </span>
          </label>

          {/* Collapsible Terms */}
          {open && (
            <div className="bg-gray-50 border p-3 rounded-md max-h-[30rem] overflow-y-auto space-y-3 text-sm">
              {legalSections.map((section, index) => (
                <div key={index}>
                  <strong className="block text-gray-800 mb-1">{section.title}</strong>
                  <p className="text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Submit Button */}
        <div className="absolute bottom-2 left-4 right-4">
          <button
            disabled={!agree || loading} // Disable the button if not agreed or if loading
            className={`w-full bg-[#5EB66E] text-white py-3 text-[16px] font-semibold rounded-md hover:bg-[#469F5E] ${!agree || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex justify-center items-center">
              <div className="border-4 border-t-4 border-gray-200 border-t-[#fff] w-5 h-5 rounded-full animate-spin"></div>
            </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TermsAndConditions;


// import React, { useState } from "react";

// const TermsAndConditions = () => {
//   const [isAccepted, setIsAccepted] = useState(false);

//   const handleCheckboxChange = (e) => {
//     setIsAccepted(e.target.checked);
//   };

//   const handleSubmit = () => {
//     if (isAccepted) {
//       alert("Thank you for accepting the terms and conditions.");
//     } else {
//       alert("Please accept the terms and conditions to proceed.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
//       <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-center mb-4">Terms and Conditions</h1>
//         <div className="text-gray-700 text-sm mb-6 max-h-60 overflow-y-auto border border-gray-300 rounded p-4">
//           <p>
//             Welcome to our platform. Please read the following terms and conditions carefully before using our
//             services.
//           </p>
//           <ul className="list-disc pl-5 mt-2">
//             <li>You must be at least 18 years old to use our services.</li>
//             <li>Do not use the platform for any illegal activities.</li>
//             <li>We reserve the right to modify these terms at any time.</li>
//             <li>Your personal data will be processed in accordance with our privacy policy.</li>
//             <li>All intellectual property rights are reserved.</li>
//           </ul>
//           <p className="mt-2">
//             By accepting these terms, you agree to comply with all the rules mentioned here. If you do not agree, please
//             do not use our platform.
//           </p>
//         </div>

//         <div className="flex items-center mb-4">
//           <input
//             type="checkbox"
//             id="acceptTerms"
//             checked={isAccepted}
//             onChange={handleCheckboxChange}
//             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="acceptTerms" className="ml-2 text-gray-700 text-sm">
//             I have read and accept the Terms and Conditions.
//           </label>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={!isAccepted}
//           className={`w-full py-2 px-4 text-white rounded ${
//             isAccepted ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TermsAndConditions;

