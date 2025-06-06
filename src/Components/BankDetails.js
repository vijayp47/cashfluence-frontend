import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from "react-router-dom";
import useAccountStore from './store/useAccountStore';
import { FaUser, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import useStore from "./store/userProfileStore";
import Loader from "./Loader";
import { getAccountData, fetchLiabilities, getRiskScore } from "../API/apiServices";
import { BsBank2 } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoInformationCircle } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import useRiskStore from './store/useRiskStore';
import Swal from "sweetalert2"; // Import SweetAlert

import { FaRegTrashAlt } from "react-icons/fa";
import { RiDeleteBack2Line } from "react-icons/ri";


const BASE_URL = process.env.REACT_APP_BASE_URL;  

const UserBankDetails = () => {
  const navigate = useNavigate();
  const { profileData, fetchProfileData } = useStore();
  const [openAccountIndex, setOpenAccountIndex] = useState(null);
  const { accountData, setAccountData,fetchAccountData, removeDeletedBank, removeDeletedAccount } = useAccountStore();
  const [loading, setLoading] = useState(false);
  const [liabilities, setLiabilities] = useState(null);
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [linkToken, setLinkToken] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [accessTokens, setAccessTokens] = useState(null);
  const setRiskData = useRiskStore((state) => state.setRiskData);
  
  const getAuthToken = () => localStorage.getItem('userToken') || '';
  const userId = localStorage.getItem("user_id");
  const calculateAverageRiskScoreAndLevel = (data) => {
    const riskScores = data.results.map((item) => parseFloat(item.riskScore));
    const totalRiskScore = riskScores.reduce((sum, score) => sum + score, 0);
    const averageRiskScore = totalRiskScore / riskScores.length;
    let averageRiskLevel;
    if (averageRiskScore <= 3) {
      averageRiskLevel = "Low";
    } else if (averageRiskScore <= 7) {
      averageRiskLevel = "Medium";
    } else {
      averageRiskLevel = "High";
    }
    return {
      averageRiskScore: averageRiskScore.toFixed(2),
      averageRiskLevel: averageRiskLevel
    };
  };

  useEffect(() => {
    if (userId) {
      fetchAccountData();
    }
  }, [userId]);


  useEffect(() => {
    const token = getAuthToken();
    if (userId && token) {
      const fetchAccountDetails = async () => {
        try {
          setLoading(true);
          const accountDataResponse = await getAccountData(userId);
          setAccountData(accountDataResponse);
          
          const tokens = [];
          accountDataResponse.forEach(institution => {
            tokens.push(institution?.accessToken);
          });
          setAccessTokens(tokens);
          
          try {
            const data = await getRiskScore(tokens);
            setRiskScore(data);
            const result = calculateAverageRiskScoreAndLevel(data);
            localStorage.setItem("averageRiskLevel", result.averageRiskLevel);
            localStorage.setItem("averageRiskScore", result.averageRiskScore);
           
          } catch (err) {
            console.error(err);
          }
        } catch (error) {
          console.error("Error fetching account data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAccountDetails();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const liabilitiesData = await fetchLiabilities();
      setLiabilities(liabilitiesData);
      const accountDataResponse = await getAccountData(userId);
      setAccountData(accountDataResponse);
      const tokens = [];
      accountDataResponse.forEach(institution => tokens.push(institution?.accessToken));
      const data = await getRiskScore(tokens);
      setRiskScore(data);
      const result = calculateAverageRiskScoreAndLevel(data);
      localStorage.setItem("averageRiskLevel", result.averageRiskLevel);
      localStorage.setItem("averageRiskScore", result.averageRiskScore);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profileData) {
      fetchProfileData();
    }
  }, [profileData]);
const handleContinue = () => {
  // Define which subtypes are allowed for disbursement
  const allowedSubtypes = ["checking", "savings"];

  // Check if any account in any institution is a depository with allowed subtype
  const hasAllowedDepository = accountData.some(institution =>
    institution.accounts.some(account =>
      account.type === "depository" && allowedSubtypes.includes(account.subtype)
    )
  );

  if (!hasAllowedDepository) {
    toast.error("To disburse the amount, please add a valid checking or savings account.");
  } else {
    navigate("/socialaccount");
  }
};


  useEffect(() => {
    const token = getAuthToken();
    fetch(`${BASE_URL}/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setLinkToken(data.link_token))
      .catch((error) => console.error('Error fetching link token:', error));
  }, []);

  const { open, ready } = usePlaidLink({
    
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
  
      const token = getAuthToken();
      try {
        setLoading(true);
      
        const response = await fetch(`${BASE_URL}/plaid/public_token`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ public_token }),
        });
        const data = await response.json();
        setIsAccountLinked(true);
        localStorage.setItem("plaidToken", data.accessToken);
        await fetchData();
      } catch (error) {
        console.error("Error linking account:", error);
        setIsAccountLinked(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const toggleAccountDetails = (index) => {
    setOpenAccountIndex(openAccountIndex === index ? null : index);
  };

  const deleteBank = async (institutionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = getAuthToken();
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/plaid/delete-bank`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, institutionId }),
          });

          if (response.ok) {
            Swal.fire("Deleted!", "Bank has been removed.", "success");
            removeDeletedBank(institutionId);
          } else {
            Swal.fire("Error!", "Failed to delete bank.", "error");
          }
        } catch (error) {
          console.error("Error deleting bank:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const deleteAccount = async (accountId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = getAuthToken();
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/plaid/delete-account`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, accountId }),
          });

          if (response.ok) {
            Swal.fire("Deleted!", "Account has been removed.", "success");
            removeDeletedAccount(accountId);
          } else {
            Swal.fire("Error!", "Failed to delete account.", "error");
          }
        } catch (error) {
          console.error("Error deleting account:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  console.log("accountData",accountData);
  
  return (
    <>
      <div className="flex justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-2">
        <div className="bg-white shadow-2xl rounded-xl w-full max-w-[30rem] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center border-b p-4 bg-gray-50">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="font-sans text-lg font-extrabold text-gray-800">Bank Details</h1>
            <div className="ml-auto relative group">
              <button className="flex items-left" onClick={() => navigate('/profile')}>
                {profileData?.image ? (
                  <img src={profileData?.image} alt="Profile" className="w-8 h-8 rounded-full bg-[#000000]" />
                ) : (
                  <FaUser size={25} className="text-[#383838]" />
                )}
              </button>
              <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Profile
              </span>
            </div>
          </div>
  
          {/* Bank Accounts Section */}
          <div className="p-6 space-y-6">
            {/* Add Bank Account Button */}
            <div className="flex w-full justify-end relative group">
              <button
                onClick={() => open()}
                disabled={!ready}
                className="w-[5vw] h-[4vh] flex justify-center items-center mt-1 text-white text-sm font-semibold rounded-lg"
              >
                <IoIosAddCircle className="text-green-500 size-14" />
              </button>
              <span className="font-sans absolute top-[45px] right-5 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Add Account
              </span>
            </div>
  
            {loading || !linkToken ? (
              <Loader />
            ) : (
              accountData && accountData.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {accountData.map((bank, bankIndex) => (
                    <div key={bankIndex} className="bg-gray-50 rounded-lg shadow-md w-full p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <BsBank2 className="text-green-600 text-2xl mt-1 mr-3" />
                          <h2 className="text-lg font-bold text-green-600 border-b pb-2">
                            {bank.institution_name || "N/A"}
                          </h2>
                        </div>
                        {/* Delete Icon Button */}
                        <button onClick={() => deleteBank(bank.institution_id)} className="text-red-500 hover:text-red-700">
                        <FaRegTrashAlt size={18} />
                       
                        </button>
                      </div>
  
                      {bank.accounts.map((account, accountIndex) => (
                        <div key={accountIndex} className="bg-gray-100 rounded-lg shadow-md mb-4 relative">
                          {/* Delete Button at the Top Right */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents toggle click
                              deleteAccount(account.accountId);
                            }}
                            className="mt-4 absolute top-2 right-5 text-red-500 hover:text-red-700"
                          >
                             <RiDeleteBack2Line size={18} />
                             
                          </button>

                          {/* Header with Account Info and Arrow */}
                          <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => toggleAccountDetails(`${bankIndex}-${accountIndex}`)}
                          >
                            {/* Account Info */}
                            <div>
                              <div className='flex'>
                                <MdAccountBalanceWallet className='mt-1 mr-2' />
                                <h3 className="font-semibold text-gray-800">{account.name || "N/A"}</h3>
                              </div>
                              <p className="text-sm text-gray-600"><strong>Account Number:</strong> {account.mask || "N/A"}</p>
                              <p className="text-sm text-gray-600"><strong>Account Type:</strong> {account.type || "N/A"}</p>
                              <p className="text-sm text-gray-600"><strong>Account SubType:</strong> {account.subtype || "N/A"}</p>
                              <p className="text-sm text-gray-600"><strong>Official Name:</strong> {account.officialName || "N/A"}</p>
                            </div>

                            {/* Arrow Button */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-6 w-6 transform transition-transform ${openAccountIndex === `${bankIndex}-${accountIndex}` ? "rotate-180" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {/* Expandable Account Details */}
                          {openAccountIndex === `${bankIndex}-${accountIndex}` && (
                            <div className="p-4 border-t bg-white space-y-4">
                              <h4 className="text-md font-bold text-gray-700 mb-2">Account Details</h4>
                              <p className="text-sm text-gray-600"><strong>Available Balance:</strong> {account.balances.available ? `$${account.balances.available}` : "N/A"}</p>
                              <p className="text-sm text-gray-600"><strong>Current Balance:</strong> {account.balances.current ? `$${account.balances.current}` : "N/A"}</p>

                              {account.mortgage && (
                                <div className="mt-4 space-y-2">
                                  <div className="flex items-center">
                                    <IoInformationCircle className="text-2xl mt-1 mr-2" />
                                    <h5 className="font-semibold text-gray-700">Mortgage Information</h5>
                                  </div>
                                  <p className="text-sm text-gray-600"><strong>Account Number:</strong> {account.mortgage.accountNumber}</p>
                                  <p className="text-sm text-gray-600"><strong>Interest Rate:</strong> {account.mortgage.interestRatePercentage}%</p>
                                  <p className="text-sm text-gray-600"><strong>Next Payment Due:</strong> {new Date(account.mortgage.nextPaymentDueDate).toLocaleDateString()}</p>
                                  <p className="text-sm text-gray-600"><strong>Loan Type:</strong> {account.mortgage.loanTypeDescription}</p>
                                </div>
                              )}

                              {account.studentLoan && (
                                <div className="mt-4 space-y-2">
                                  <div className="flex items-center">
                                    <IoInformationCircle className="text-2xl mt-1 mr-2" />
                                    <h5 className="font-semibold text-gray-700">Student Loan Information</h5>
                                  </div>
                                  <p className="text-sm text-gray-600"><strong>Loan Name:</strong> {account.studentLoan.loanName || "N/A"}</p>
                                  <p className="text-sm text-gray-600"><strong>Minimum Payment:</strong> ${account.studentLoan.minimumPaymentAmount || "N/A"}</p>
                                  <p className="text-sm text-gray-600"><strong>Next Payment Due:</strong> {new Date(account.studentLoan.nextPaymentDueDate).toLocaleDateString()}</p>
                                  <p className="text-sm text-gray-600"><strong>Outstanding Interest:</strong> ${account.studentLoan.outstandingInterestAmount || "N/A"}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[50vh] flex-col items-center justify-center">
                  <h1 className="text-center text-lg font-semibold text-grey">
                    No Bank Accounts Found<br/>
                    please add a bank account to proceed.
                  </h1>
                </div>
              )
            )}
          </div>
  
          {accountData && accountData.length > 0 && (
            <div className="p-6">
              <button
                onClick={handleContinue}
                disabled={loading || !linkToken}
                className={`w-full py-3 text-lg font-bold rounded-lg shadow-lg ${
                  loading || !linkToken ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#5EB66E] text-white"
                }`}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default UserBankDetails;

