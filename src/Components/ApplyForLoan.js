import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import useRiskStore from "./store/useRiskStore";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { ToastContainer, toast } from 'react-toastify';
import CheckoutForm from '../../src/Components/CheckoutForm';
import { loadStripe } from "@stripe/stripe-js";
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchStateAnnualPercentageRate,updateStatusForIdentityPayment,fetchLastLoginAt
} from "../API/apiServices";
import Swal from "sweetalert2";
import Loader from "./Loader";
import useStore from "./store/userProfileStore";
import useInfluencerStore from "./store/useInfluencerStore";
import useAccountStore from "./store/useAccountStore";

const ApplyForLoan = () => {
  const stripePromise = loadStripe("pk_test_51PnDYCHJvnanatbhqplAFXJaRmLHiZf225u3hQ4FL3AcN5ear6ZZsggNWieJcHnf5pacaIYT3gB2k2ti0LsWOyRo00dEmBlxTO");
  
  const { influencerProfile, score, isLoading, fetchInfluencerProfile } = useInfluencerStore();
  const { profileData, fetchProfileData } = useStore();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(1200);
  const [repaymentTerm, setRepaymentTerm] = useState("60");
  const [accountNumber, setAccountNumber] = useState();
  const [loading, setLoading] = useState();
  const [fetchedAPR, setFetchedAPR] = useState(null);
  const [selectedInstitutionFrom, setSelectedInstitutionFrom] = useState(null);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedInstitutionTo, setSelectedInstitutionTo] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const {accountData, setAccountData,fetchAccountData} = useAccountStore();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [hasPaidForVerification, setHasPaidForVerification] = useState(false);
    const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [err,setErr]=useState(false);
  const [stateLawAndLoanTermWeight, setStateLawAndLoanTermWeight] =
    useState(null);
    const averageRiskLevel = localStorage.getItem("averageRiskLevel");
    const riskScore = localStorage.getItem("averageRiskScore");
   
   
    const [errors, setErrors] = useState({
      loanAmount: '',
      repaymentTerm: '',
      fromAccount: '',
     
    });
    const [state, setState] = useState(null);

    const [lastLoginAt, setLastLoginAt] = useState(null);
   
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const getLastLogin = async () => {
        try {
          const lastLogin = await fetchLastLoginAt();
          setLastLoginAt(lastLogin);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      getLastLogin();
    }, []);
  
   
    const startPaymentProcess = async () => {
      try {
        const { data } = await axios.post(
          `${BASE_URL}/payment/create-payment-intent`,
          { amount: 80, currency: "usd" },
          { headers: { "Content-Type": "application/json" } }
        );
        setClientSecret(data.clientSecret);
        console.log("clientSecret",data.clientSecret)
        setShowPaymentModal(true);
        setShowPaymentPrompt(false);
      } catch (error) {
        toast.error("Payment initialization failed.");
      }
    };
  
     useEffect(() => {
        if (profileData?.hasPaidForVerification !== undefined) {
          setHasPaidForVerification(profileData.hasPaidForVerification);
        }
      }, [profileData]);
   
  const handlePaymentSuccess = async () => {
    try {
      const response = await updateStatusForIdentityPayment();
      
      
      if (response?.success) {
        toast.success("Payment successful! You can now proceed with Loan.");
        setHasPaidForVerification(true);
        setShowPaymentModal(false);
      } else {
        throw new Error("Failed to update payment status.");
      }
    } catch (error) {
      toast.error("Failed to update payment status.");
      console.error("Payment Status Update Error:", error);
    }
  };
  
 

// Function to fetch plaid state data
const plaidStateData = async () => {
  const userId = localStorage.getItem("user_id");

  // Check if user_id exists
  if (!userId) {
    console.error("User ID not found in localStorage");
    toast.error("User ID not found");
    setLoading(false);
    return;
  }

  try {
    const token = localStorage.getItem("userToken");
   
    const response = await fetch(`${BASE_URL}/plaid/plaid_user_state`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('State data response:', data);

    if (data.state) {
      setErr(false);
      setState(data.state); // Store the state in the component's state
    } else {
      // If the backend message is available, show that in the toast
      console.error(data.message || "State data not found");
      toast.error(data.message || "State data not found");
      setErr(true);
    }
  } catch (error) {
    console.error('Error fetching state data:', error);
    toast.error('Error fetching state data');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    plaidStateData();
  }, []); 

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchInfluencerProfile(userId);
    }
  }, [userId, fetchInfluencerProfile]); 

  useEffect(() => {
    if (!accountData) {
      fetchAccountData();
    }
  }, [accountData, fetchAccountData]);

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); 
    }
  }, [profileData, fetchProfileData]);

  useEffect(() => {
    const fetchAPR = async () => {
      try {
        const data = await fetchStateAnnualPercentageRate(
          loanAmount,
          repaymentTerm,
          state
        );
        setFetchedAPR(data?.value); 
  
        if (data?.value !== null && data?.value !== undefined) {
   
          const fetchedAPR = parseFloat(data?.value); // Ensure the fetched APR is a number
          const repaymentTermInDays = parseInt(repaymentTerm); // Ensure term is a number
  
          // Calculate Loan Term Impact (Repayment term as fraction of a year)
          const loanTermImpact = (repaymentTermInDays / 365) ;
  
          // Calculate Adjusted APR
          const adjustedAPR = fetchedAPR + loanTermImpact; // State law directly adds to fetchedAPR
          const roundedAPRWeight = adjustedAPR.toFixed(2);
          setStateLawAndLoanTermWeight(roundedAPRWeight);
        }
      } catch (error) {
        console.error("Error fetching APR:", error);
        setFetchedAPR(null); // Reset the APR if there's an error
      }
    };
    fetchAPR();
  }, [loanAmount, repaymentTerm, state]);
  
  // Handle Institution and Account change within one dropdown
  const handleSelectionChange = (value, type) => {
    const [institutionId, accountId] = value.split('-'); // Split to get institution and account IDs

    const selectedInstitution = accountData?.find(inst => inst.institution_id === institutionId);
    if (!selectedInstitution) return; // Safety check

    const selectedAccount = selectedInstitution.accounts.find(acc => acc.accountId === accountId);

    if (type === 'from') {
      setSelectedInstitutionFrom(selectedInstitution);
      setSelectedFromAccount(selectedAccount);
    } else {
      setSelectedInstitutionTo(selectedInstitution);
      setSelectedToAccount(selectedAccount);
    }
  };

  // Helper function to generate dropdown options for accounts
  const generateDropdownOptions = (institution) => {
    return institution.accounts.map((account) => (
      <option key={`${institution.institution_id}-${account.accountId}`} value={`${institution.institution_id}-${account.accountId}`}>
        {`${institution.institution_name} - ${account.name}`}
      </option>
    ));
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (loanAmount < 500 || loanAmount > 2000) {
      newErrors.loanAmount = "Loan amount must be between $500 and $2000.";
    }
  
    if (!repaymentTerm || isNaN(repaymentTerm) || repaymentTerm <= 0) {
      newErrors.repaymentTerm = "Repayment term must be a valid number.";
    }
  
    if (!selectedFromAccount || !selectedInstitutionFrom) {
      newErrors.fromAccount = "Please select a 'Loan Disbursement Account'.";
    }
  
    // if (!selectedToAccount || !selectedInstitutionTo) {
    //   newErrors.toAccount = "Please select a 'Repayment Account'.";
    // }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const calculateRate = ({
    paymentHistory,
    influencerScore,
    // externalFactors,
  }) => {
    // Define weightings for each factor
    const weights = {
      paymentHistory: 0.4,
      influencerScore: 0.3,
      // externalFactors: 0.3,
    };

    // Calculate weighted scores with proper checks
    const weightedPaymentHistory =
      (paymentHistory?.riskScore || 0) * weights.paymentHistory;
    const weightedInfluencerScore =
      ((influencerScore || 0) / 10) * weights.influencerScore;
    // const weightedExternalFactors =
    //   (externalFactors || 0) * weights.externalFactors;

    // Calculate total risk score
    const totalRateScore =
      weightedPaymentHistory +
      weightedInfluencerScore ;

    return totalRateScore.toFixed(2); // Return the total interest rounded to two decimals
  };

  // Example usage
  const riskInputs = {
    paymentHistory: riskScore,
    influencerScore: score,
    // externalFactors: stateLawAndLoanTermWeight,
  };

  const rateResult = calculateRate(riskInputs);

  const handleSliderChange = (e) => {
    setLoanAmount(e.target.value);
  };

  const handleRepaymentChange = (e) => {
    setRepaymentTerm(e.target.value);
  };



  const handleSubmit = async () => {

    if (hasPaidForVerification) {

      if (rateResult > fetchedAPR) {
        toast.error("Your interest rate has exceeded the allowed state APR limit. You cannot apply for a loan at this time. Please try again later.");
       return
     }
  
      if (!validateForm()) {
         toast.error('Fix the error before proceed');
        return
      }
      
      const token = localStorage.getItem("userToken");
      if (!token) {
        Swal.fire({
          text: "You need to be logged in to apply for a loan.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      try {
        setLoading(true);
  
  
        // If no pending payments, proceed to apply for a new loan
        const response = await fetch(`${BASE_URL}/loans/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the Authorization header with the token
          },
          body: JSON.stringify({
            amount: loanAmount,
            repaymentTerm,
            account: accountNumber,
            interest: rateResult,
            loanrequested: true,
            riskLevel: averageRiskLevel,
            riskScore: riskScore,
            fromAccount: {
              institutionId: selectedInstitutionFrom.institution_id, 
              institutionName: selectedInstitutionFrom.institution_name,
              
              accountId: selectedFromAccount.accountId, 
              accountName: selectedFromAccount.name,
              accountNumber:selectedFromAccount.mask,
              accountType: selectedFromAccount.type,
              accountSubtype: selectedFromAccount.subtype,
            },
            lastLoginAt:lastLoginAt
            // toAccount: {
            //   institutionId: selectedInstitutionTo.institution_id, 
            //   institutionName: selectedInstitutionTo.institution_name,
            //   accountId: selectedToAccount.accountId, 
            //   accountName: selectedToAccount.name,
            //   accountNumber:selectedToAccount.mask,
            //   accountType: selectedToAccount.type,
            //   accountSubtype: selectedToAccount.subtype,
            
            // },
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          Swal.fire({
            text: "Loan application submitted!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          localStorage.setItem("loanId", result?.loanApplication?.id);
  
          // Navigate to loan confirmation page
          navigate("/loanconfirmation", {
            state: { loanId: result?.loanApplication?.id },
          });
        } else {
          // Display error if loan application fails
          Swal.fire({
            text: result.message || "Failed to submit loan application.",
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          text: "An error occurred while processing your request.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setShowPaymentPrompt(true); // Open payment prompt modal
    }
    

   

 
  };

  if (loading) {
    <Loader />;
  }




  return (
    <div className="flex justify-center  min-h-screen ">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between ">
        {/* Header */}
        <div>
          <div className="font-sans flex items-center  border-b  bg-[#0000]">
            <button
              onClick={() => {
                navigate("/socialaccount");
              }}
              className="mr-4 text-[#383838] m-4 "
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
            <h1 className="font-sans text-[18px] font-extrabold text-[#383838]  ">
              Apply for a Microloan
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

          <div className="p-4 text-left">
            {" "}
            {/* Added text-left to align the content */}
            {/* <h1 className="text-[18px] font-extrabold text-[#383838] mb-4">Apply for a Microloan</h1> */}
            <p className="font-sans text-[#646464] mb-4 font-bold text-[15px]">
              Get a loan between $500 to $2000 with flexible repayment terms
            </p>
            <div className="mt-4">
              <p className="font-sans text-[#555555] font-bold text-[15px] mb-3">
                Loan Amount
              </p>
              <p className="font-sans text-[18px] font-semibold text-[#3F455D]">
                ${loanAmount}
              </p>
            </div>
            <div className="mt-3">
              <div className="relative mb-1">
                <input
                  type="range"
                  min="500"
                  max="2000"
                  step={50}
                  value={loanAmount}
                  onChange={handleSliderChange}
                  className="font-sans w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4caf50 ${
                      ((loanAmount - 500) / (2000 - 500)) * 100
                    }%, #e5e7eb ${(loanAmount - 500) / (2000 - 500)}% 100%)`,
                  }}
                />
                {errors.loanAmount && <p className="text-red-500">{errors.loanAmount}</p>}
              </div>
              <div className="flex justify-between text-gray-400 text-sm mb-1">
                <span className="font-sans text-[#9299B5] font-normal text-[14px]">
                  $500
                </span>
                <span className="font-sans text-[#9299B5] font-normal text-[14px]">
                  $2000
                </span>
              </div>
            </div>
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 30px;
                width: 30px;
                border-radius: 50%;
                background: white;
                border: 4px solid #17cee74d;
                box-shadow: inset 0 0 0 6px white, inset 0 0 0 14px #5eb66e;
              }

              input[type="range"]::-moz-range-thumb {
                height: 30px;
                width: 30px;
                border-radius: 50%;
                background: white;
                border: 4px solid #17cee74d;
                box-shadow: inset 0 0 0 6px white, inset 0 0 0 14px #5eb66e;
              }

              /* Focus state with more blue glow */
              input[type="range"]:focus::-webkit-slider-thumb {
                box-shadow: inset 0 0 0 6px white, inset 0 0 0 14px #5eb66e,
                  0px 0px 14px #17cee74d;
              }

              input[type="range"]:focus::-moz-range-thumb {
                box-shadow: inset 0 0 0 6px white, inset 0 0 0 14px #5eb66e,
                  0px 0px 14px #17cee74d;
              }
            `}</style>
            {/* Repayment Term Dropdown */}
            <div className="mt-6">
              <label
                htmlFor="firstName"
                className="  mb-3 block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left "
              >
                Repayment Term
              </label>

              <select
                id="repaymentTerm"
                value={repaymentTerm}
                onChange={handleRepaymentChange}
                name="repaymentTerm"
                className="font-sans w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <option value={30}>1 Month</option>
                <option value={60}>2 Months</option>
                <option value={90}>3 Months</option>
                <option value={120}>4 Months</option>
                <option value={150}>5 Months</option>
                <option value={180}>6 Months</option>
               
              </select>

              {errors.repaymentTerm && <p className="text-red-500">{errors.repaymentTerm}</p>}
            </div>
            {/* aCCOUNT  Dropdown */}
            <div className="mt-6">
      {/* From Account */}
      <label
        htmlFor="fromAccount"
        className="mb-3 block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left"
      >
        Loan Disbursement Account
      </label>

      <select
        id="fromAccount"
        className="font-sans w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        onChange={(e) => handleSelectionChange(e.target.value, 'from')}
        value={
          selectedFromAccount && selectedInstitutionFrom
            ? `${selectedInstitutionFrom.institution_id}-${selectedFromAccount.accountId}`
            : ""  // Set the selected option's value to institutionId-accountId
        }
      >
        <option value="">Select Account</option>
        {accountData?.map((institution) => (
          <optgroup key={institution.institution_id} label={institution.institution_name}>
            {generateDropdownOptions(institution)}
          </optgroup>
        ))}
       
       
      </select>
      {errors.fromAccount && <p className="text-red-500">{errors.fromAccount}</p>}
      {/* To Account */}
      {/* <div className="mt-6">
        <label
          htmlFor="toAccount"
          className="mb-3 block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left"
        >
          Repayment Account
        </label>

        <select
          id="toAccount"
          className="font-sans w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          onChange={(e) => handleSelectionChange(e.target.value, 'to')}
          value={
            selectedToAccount && selectedInstitutionTo
              ? `${selectedInstitutionTo.institution_id}-${selectedToAccount.accountId}`
              : ""  // Set the selected option's value to institutionId-accountId
          }
        >
          <option value="">Select Account</option>
          {accountData?.map((institution) => (
            <optgroup key={institution.institution_id} label={institution.institution_name}>
              {generateDropdownOptions(institution)}
            </optgroup>
          ))}
        </select>
        {errors.toAccount && <p className="text-red-500">{errors.toAccount}</p>}

      </div> */}
    </div>


            {/* Risk Profile Section */}
            <div className="font-sans mt-6 bg-green-50 p-4 rounded-lg">
              <p className="font-sans font-semibold text-[#0D0D0D]">
                • Risk Profile
              </p>
              <div className="font-sans flex items-center my-1">
                <span
                  className={`font-sans h-3 w-3 rounded-full inline-block mr-2 ${
                    averageRiskLevel === "Low"
                      ? "bg-[#5EB66E]" // Green for low
                      : averageRiskLevel === "Medium"
                      ? "bg-[#FFCC00]" // Yellow for medium
                      : averageRiskLevel === "High"
                      ? "bg-[#FF0000]" // Red for high
                      : "" // Default if riskLevel is not available
                  }`}
                ></span>

                <p className="font-sans font-medium text-[14px]">
                {averageRiskLevel || "-"}
                </p>
              </div>
              <p className="font-sans font-semibold mt-4 text-[#0D0D0D]">
                • Estimated Interest Rate
              </p>
              <p className="font-sans text-4xl text-[#0D0D0D] font-bold mt-2">
                {rateResult ? `${rateResult}%` : "-"}
              </p>
              <p className="font-sans text-[#646464]">
                Based on your risk profile
              </p>
            </div>
            {/* Apply Button */}
          </div>
        </div>

        {/* Submit Button at Bottom */}
        <div className="p-4">
        <button
          onClick={handleSubmit}
          disabled={Number(rateResult) === 0} // Ensure it's compared correctly
          className={`w-full font-sans py-3 text-[16px] font-semibold rounded-md focus:outline-none focus:ring-2 ${
            Number(rateResult) === 0 || err || averageRiskLevel === null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state
              : "bg-[#5EB66E] text-white hover:bg-[#469F5E] focus:ring-[#5EB66E]" // Enabled state
          }`}
        >
          Apply for Loan
        </button>
        </div>
      </div>
       {/* Payment Prompt Modal */}
    {showPaymentPrompt && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
              <p className="mb-4 text-gray-700">You need to make a one-time payment for identity verification.</p>
              <button className="px-4 py-2 bg-[#5EB66E] text-white rounded mb-3" onClick={startPaymentProcess}>
                Proceed to Payment
              </button>
              <br/>
              <button className="mt-1 text-red-600 font-semibold text-lg block w-full text-center" onClick={() => setShowPaymentPrompt(false)}>
                Cancel
              </button>
            </div>
          </div>
      )}
    {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          {showPaymentModal && (
            <CheckoutForm onSuccess={handlePaymentSuccess} onClose={() => setShowPaymentModal(false)} clientSecret={clientSecret}/>
          )}
        </Elements>
      )}

        <ToastContainer position="top-center" autoClose={2000} />
    </div>
    
  );
};

export default ApplyForLoan;

