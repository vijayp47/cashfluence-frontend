import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { ToastContainer, toast } from "react-toastify";
import CheckoutForm from "../../src/Components/CheckoutForm";
import stateCodeToName from "../constants/stateCodeToName";

import "react-toastify/dist/ReactToastify.css";
import {
  updateStatusForIdentityPayment,
  checkLoanCompliance,
  getWeightConfig,
  getTermsAcceptanceStatus,
  getUserLoans,generateProcessToken,saveProcessToken
} from "../API/apiServices";
import Swal from "sweetalert2";
import Loader from "./Loader";
import useStore from "./store/userProfileStore";
import useInfluencerStore from "./store/useInfluencerStore";
import useAccountStore from "./store/useAccountStore";

const ApplyForLoan = () => {
  const { influencerProfile, score, isLoading, fetchInfluencerProfile } =
    useInfluencerStore();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { profileData, fetchProfileData } = useStore();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(500);
  const [repaymentTerm, setRepaymentTerm] = useState("15");
  const [accountNumber, setAccountNumber] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedInstitutionFrom, setSelectedInstitutionFrom] = useState(null);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedInstitutionTo, setSelectedInstitutionTo] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const { accountData, setAccountData, fetchAccountData } = useAccountStore();
  const [clientSecret, setClientSecret] = useState(null);
  const [err, setErr] = useState(false);
  const [complianceData, setComplianceData] = useState(null);
  const [canApplyForLoan, setCanApplyForLoan] = useState(null);
  const averageRiskLevel = localStorage.getItem("averageRiskLevel");
  const riskScore = localStorage.getItem("averageRiskScore");
  const [riskScoreWeights, setRiskScoreWeights] = useState(null);
  const [eligibilityErr, setEligibilityErr] = useState(null);
  // New state variables for compliance response data
  const [adjustedInterestRate, setAdjustedInterestRate] = useState(null);
  const [additionalFees, setAdditionalFees] = useState(null);
  const [feeDescription, setFeeDescription] = useState(null);
  const [eligibilityCheckLoading, setEligibilityCheckLoading] = useState(false);
  const [accountId,setAccountId]=useState(null);
  const [ accessToken,setAccessToken]=useState(null);
const [isTokenForDisbursementLoading,setIsTokenForDisbursementLoading]= useState(false);
  const [errors, setErrors] = useState({
    loanAmount: "",
    repaymentTerm: "",
    fromAccount: "",
  });
  const [state, setState] = useState(null);
  const [isLoadings, setIsLoadings] = useState(false);
  const [lastLoginAt, setLastLoginAt] = useState(null);
  const [error, setError] = useState(null);

  // Effect for fetching terms acceptance status
  useEffect(() => {
    const fetchTermsStatus = async () => {
      try {
        const response = await getTermsAcceptanceStatus();
        setTermsAccepted(response.termsAccepted);
      } catch (error) {
        console.error("Error fetching terms acceptance status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsStatus();
  }, []);

  // Effect for tracking influencer score
  useEffect(() => {
    if (!isLoading && score !== 0) {
      console.log("Final Score: ", score);
    }
  }, [score, isLoading]);

  // Effect for checking loan eligibility
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("User ID not found.");
          setIsLoadings(false);
          return;
        }

        const result = await getUserLoans(userId);
        const canApplyForNewLoan = !result.data.some(
          (loan) => loan.isLoanComplete === false
        );
        setCanApplyForLoan(canApplyForNewLoan);
      } catch (error) {
        const customMsg =
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch loans";
        setError(customMsg);
      } finally {
        setIsLoadings(false);
      }
    };

    fetchLoans();
  }, []);

  // Function to fetch plaid state data
  const plaidStateData = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      toast.error("User ID not found");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch(`${BASE_URL}/plaid/plaid_user_state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.state) {
        setErr(false);
        setState(data.state);
      } else {
        console.error(data.message || "State data not found");
        toast.error(data.message || "State data not found");
        setErr(true);
      }
    } catch (error) {
      console.error("Error fetching state data:", error);
      toast.error("Error fetching state data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    plaidStateData();
  }, []);

  const userId = localStorage.getItem("userId");

  // Effect for fetching influencer profile
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchInfluencerProfile(userId);
    }
  }, [userId, fetchInfluencerProfile]);

  // Effect for fetching account data
  useEffect(() => {
    if (!accountData) {
      fetchAccountData();
    }
  }, [accountData, fetchAccountData]);

  // Effect for fetching user profile data
  useEffect(() => {
    if (!profileData) {
      fetchProfileData();
    }
  }, [profileData, fetchProfileData]);

  // Effect for fetching weight configurations
  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        const { rateWeights } = await getWeightConfig();

        setRiskScoreWeights(rateWeights);
      } catch (err) {
        console.error("Could not calculate rate", err);
      }
    };

    fetchAndCalculate();
  }, []);

  // Rate calculation function
  const calculateRate = ({ paymentHistory, influencerScore }) => {
    // Define weightings for each factor
    const weights = {
      paymentHistory: riskScoreWeights?.paymentHistory / 100,
      influencerScore: riskScoreWeights?.influencerScore / 100,
    };

    // Calculate weighted scores with proper checks
    const weightedPaymentHistory = (riskScore || 0) * weights.paymentHistory;
    const weightedInfluencerScore =
      ((influencerScore || 0) / 10) * weights.influencerScore;

    // Calculate total risk score
    const totalRateScore = weightedPaymentHistory + weightedInfluencerScore;

    return totalRateScore.toFixed(2); // Return the total interest rounded to two decimals
  };

  // Risk input parameters
  const riskInputs = {
    paymentHistory: riskScore,
    influencerScore: score,
  };

  const rateResult = calculateRate(riskInputs);

  useEffect(() => {
    // Show the loader immediately when useEffect is triggered
    setEligibilityCheckLoading(true);

    const checkCompliance = async () => {
      setEligibilityErr(null);

      // Ensure we have the necessary values before proceeding
      if (state && loanAmount && repaymentTerm && rateResult) {
        const fullStateName = stateCodeToName[state.toUpperCase()]; // Convert state code to full state name
        if (!fullStateName) {
          setEligibilityCheckLoading(false); // Hide loader if invalid state code
          throw new Error("Invalid state code");
        }

        try {
          // Make the API call to check loan compliance
          const complianceData = await checkLoanCompliance({
            state: fullStateName,
            loan_term: repaymentTerm,
            loan_amount: loanAmount,
            calculated_interest: rateResult,
          });

          // Handle API response based on eligibility
          if (complianceData?.eligible) {
            setComplianceData(complianceData);
            setAdjustedInterestRate(complianceData?.adjusted_interest);
            setAdditionalFees(complianceData?.additional_fees);
            setFeeDescription(complianceData?.fee_description);
            setEligibilityCheckLoading(false); // Hide loader after receiving data
          } else {
            toast.error(
              complianceData?.message ||
                "Loan not allowed under state compliance rules."
            );
            setEligibilityCheckLoading(false); // Hide loader if not eligible
          }
        } catch (error) {
          console.error("Error checking loan compliance:", error);
          setEligibilityCheckLoading(false); // Hide loader on error
          setEligibilityErr(error);
        }
      } else {
        setEligibilityCheckLoading(false); // Hide loader if missing data
      }
    };

    // Call the checkCompliance function immediately
    checkCompliance();
  }, [state, loanAmount, repaymentTerm, rateResult]);

  // Handle Institution and Account change within one dropdown
  const handleSelectionChange = (value, type) => {
    const [institutionId, accountId] = value.split("-"); // Split to get institution and account IDs
     const selectedInstitution = accountData?.find(
      (inst) => inst.institution_id === institutionId
    );
    if (!selectedInstitution) return; // Safety check

    const selectedAccount = selectedInstitution.accounts.find(
      (acc) => acc.accountId === accountId
    );
const accessToken = selectedInstitution?.accessToken;
  if (!accessToken || !accountId) {
    console.error("Missing access token or account ID");
    return;
  }
  setAccessToken(accessToken);
  setAccountId(accountId);

 

   

    if (type === "from") {
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
      <option
        key={`${institution.institution_id}-${account.accountId}`}
        value={`${institution.institution_id}-${account.accountId}`}
      >
        {`${institution.institution_name} - ${account.name}`}
      </option>
    ));
  };
  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    if (loanAmount < 200 || loanAmount > 5000) {
      newErrors.loanAmount = "Loan amount must be between $500 and $2000.";
    }

    if (!repaymentTerm || isNaN(repaymentTerm) || repaymentTerm <= 0) {
      newErrors.repaymentTerm = "Repayment term must be a valid number.";
    }

    if (!selectedFromAccount || !selectedInstitutionFrom) {
      newErrors.fromAccount = "Please select a 'Loan Disbursement Account'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers for form inputs
  const handleSliderChange = (e) => {
    setLoanAmount(e.target.value);
  };

  const handleRepaymentChange = (e) => {
    setRepaymentTerm(e.target.value);
  };

  // Handle form submission
 const handleSubmit = async () => {
  if (!termsAccepted) {
    toast.info(
      <span>
        Please accept the{" "}
        <a href="/terms-conditions" className="text-blue-500 underline">
          Terms and Conditions
        </a>{" "}
        before applying for the loan.
      </span>
    );
    return;
  }

  if (!validateForm()) {
    return;
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

  const userId = localStorage.getItem("user_id");
  let processToken;

  try {
    setIsTokenForDisbursementLoading(true);
    processToken = await generateProcessToken(accountId, accessToken);
    console.log("Process token generated:", processToken);

    if (!processToken) {
      throw new Error("No process token returned");
    }
  } catch (err) {
    console.error("Error generating process token:", err.message);
    toast.error(` ${err.message}`);
    setIsTokenForDisbursementLoading(false);
    return; // Stop execution here
  }

  try {
    await saveProcessToken(processToken, userId);
    console.log("Process token saved successfully");
  } catch (saveError) {
    console.error("Failed to save process token:", saveError.message);
    toast.error(`${saveError.message}`);
    setIsTokenForDisbursementLoading(false);
    return; // Stop execution here
  } finally {
    setIsTokenForDisbursementLoading(false);
  }

  // If we reached here, both tokens are successfully handled
  try {
    setLoading(true);

    const fullStateName = stateCodeToName[state.toUpperCase()];
    if (!fullStateName) {
      throw new Error("Invalid state code");
    }

    if (eligibilityErr?.message) {
      toast?.error(eligibilityErr?.message);
      setLoading(false);
      return;
    }

    const totalAmount =
      additionalFees !== null && additionalFees !== undefined
        ? Number(loanAmount) + Number(additionalFees)
        : Number(loanAmount);

    const response = await fetch(`${BASE_URL}/loans/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: totalAmount,
        fee: additionalFees ?? null,
        repaymentTerm,
        account: accountNumber,
        interest: adjustedInterestRate || rateResult,
        loanrequested: true,
        riskLevel: averageRiskLevel,
        riskScore,
        additionalFees,
        feeDescription,
        fromAccount: {
          institutionId: selectedInstitutionFrom.institution_id,
          institutionName: selectedInstitutionFrom.institution_name,
          accountId: selectedFromAccount.accountId,
          accountName: selectedFromAccount.name,
          accountNumber: selectedFromAccount.mask,
          accountType: selectedFromAccount.type,
          accountSubtype: selectedFromAccount.subtype,
        },
        lastLoginAt,
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
      navigate("/loanconfirmation", {
        state: { loanId: result?.loanApplication?.id },
      });
    } else {
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
};

  if (loading || isLoadings) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="font-sans flex items-center border-b bg-[#0000]">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-[#383838] m-4"
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
            <h1 className="font-sans text-[18px] font-extrabold text-[#383838]">
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
                  min="200"
                  max="5000"
                  step={100}
                  value={loanAmount}
                  onChange={handleSliderChange}
                  className="font-sans w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4caf50 ${
                      ((loanAmount - 200) / (5000 - 200)) * 100
                    }%, #e5e7eb ${(loanAmount - 200) / (5000 - 200)}% 100%)`,
                  }}
                />
                {errors.loanAmount && (
                  <p className="text-red-500">{errors.loanAmount}</p>
                )}
              </div>
              <div className="flex justify-between text-gray-400 text-sm mb-1">
                <span className="font-sans text-[#9299B5] font-normal text-[14px]">
                  $200
                </span>
                <span className="font-sans text-[#9299B5] font-normal text-[14px]">
                  $5000
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
                htmlFor="repaymentTerm"
                className="mb-3 block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left"
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
                <option value={5}>5 Days</option>
                <option value={10}>10 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>1 Month</option>
                <option value={60}>2 Months</option>
                <option value={90}>3 Months</option>
                <option value={120}>4 Months</option>
                <option value={150}>5 Months</option>
                <option value={180}>6 Months</option>
              </select>

              {errors.repaymentTerm && (
                <p className="text-red-500">{errors.repaymentTerm}</p>
              )}
            </div>
            {/* Account Dropdown */}
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
                onChange={(e) => handleSelectionChange(e.target.value, "from")}
                value={
                  selectedFromAccount && selectedInstitutionFrom
                    ? `${selectedInstitutionFrom.institution_id}-${selectedFromAccount.accountId}`
                    : ""
                }
              >
                <option value="">Select Account</option>
                {accountData?.map((institution) => (
                  <optgroup
                    key={institution.institution_id}
                    label={institution.institution_name}
                  >
                    {generateDropdownOptions(institution)}
                  </optgroup>
                ))}
              </select>
              {errors.fromAccount && (
                <p className="text-red-500">{errors.fromAccount}</p>
              )}
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

              {eligibilityCheckLoading ? (
                <p className="font-sans mt-2">Calculating... Please wait </p>
              ) : (
                <p className="font-sans text-4xl text-[#0D0D0D] font-bold mt-2">
                  {adjustedInterestRate !== null
                    ? `${adjustedInterestRate}%`
                    : rateResult
                    ? `${rateResult}%`
                    : "-"}
                </p>
              )}

              <p className="font-sans text-[#646464]">
                Based on your risk profile
              </p>
              {additionalFees !== null && additionalFees !== undefined && (
                <>
                  <p className="font-sans font-semibold mt-4 text-[#0D0D0D]">
                    • Additional Fees
                  </p>
                  <p className="font-sans text-xl text-[#0D0D0D] font-bold mt-2">
                    ${additionalFees}
                  </p>
                  <p className="font-sans text-[#646464]">{feeDescription}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button at Bottom */}
        <div className="p-4">
          <button
            onClick={handleSubmit}
            disabled={Number(rateResult) === 0}
            className={`w-full font-sans py-3 text-[16px] font-semibold rounded-md focus:outline-none focus:ring-2 ${
              Number(rateResult) === 0 || err || averageRiskLevel === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state
                : "bg-[#5EB66E] text-white hover:bg-[#469F5E] focus:ring-[#5EB66E]" // Enabled state
            }`}
          >
          {isTokenForDisbursementLoading || eligibilityCheckLoading ?
<><div className="flex justify-center">
  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
</div>
</>
 : "Apply for Loan"}  
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ApplyForLoan;
