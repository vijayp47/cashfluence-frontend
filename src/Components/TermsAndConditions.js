import React, { useState, useEffect } from 'react';
import { BiLogOutCircle, BiMinus, BiPlus } from 'react-icons/bi';
import { FaUser } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import useStore from "./store/userProfileStore"; 

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const { profileData, fetchProfileData } = useStore();

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data if not already present
    }
  }, [profileData, fetchProfileData]);



  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md flex flex-col">
        {/* {/ Header /} */}
        <div className="flex items-center border-b p-4 bg-gray-50">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="font-sans text-lg font-extrabold text-gray-800">Terms and Conditions</h1>
          <div className="ml-auto relative group">
            <button className="flex items-left" onClick={() => navigate('/profile')}>
            {profileData?.image ? <img src={profileData?.image} alt="Profile" className="w-8 h-8 rounded-full bg-[#000000]" /> : <FaUser size={25} className="text-[#383838]" />}
            </button>
            <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </div>
        </div>

        {/* {/ Terms and Conditions Content /} */}
        <div className="p-4 text-left">
          <div className="mt-4">
            {[ 
              {
                title: "Acceptance of Terms",
                content: "By accessing or using our services, you agree to be bound by these terms and conditions.By accessing or using our services, you agree to be bound by these terms and conditions.By accessing or using our services, you agree to be bound by these terms and conditions.By accessing or using our services, you agree to be bound by these terms and conditions.By accessing or using our services, you agree to be bound by these terms and conditions.By accessing or using our services, you agree to be bound by these terms and conditions."
              },
              {
                title: "Modification of Terms",
                content: "We reserve the right to modify these terms at any time without prior notice.We reserve the right to modify these terms at any time without prior notice.We reserve the right to modify these terms at any time without prior notice."
              },
              {
                title: "User Responsibilities",
                content: "You are responsible for maintaining the confidentiality of your account information.You are responsible for maintaining the confidentiality of your account information."
              },
              {
                title: "Limitation of Liability",
                content: "We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.We are not liable for any indirect, incidental, or consequential damages arising from your use of our services."
              },
              {
                title: "Governing Law",
                content: "These terms are governed by the laws of the jurisdiction in which our company is based.These terms are governed by the laws of the jurisdiction in which our company is based.These terms are governed by the laws of the jurisdiction in which our company is based."
              }
            ].map((item, index) => (
              <div key={index} className="border-b pb-2 mt-4">
                <div
                  className="flex items-center justify-between cursor-pointer  hover:bg-gray-200 rounded-md"
                
                >
                  <h2 className="font-bold text-gray-800">{item.title}</h2>
                
                </div>
               
                  <p className="text-gray-600 mt-2">{item.content}</p>
             
              </div>
            ))}
          </div>
        </div>
      </div>
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

