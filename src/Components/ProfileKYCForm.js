import React, { useState,useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import useStore from "./store/userProfileStore"; 
import Loader from "./Loader";
import CheckoutForm from '../../src/Components/CheckoutForm'
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {updateStatusForIdentityPayment} from "../API/apiServices"

const stripePromise = loadStripe("pk_test_51PnDYCHJvnanatbhqplAFXJaRmLHiZf225u3hQ4FL3AcN5ear6ZZsggNWieJcHnf5pacaIYT3gB2k2ti0LsWOyRo00dEmBlxTO");


const ProfileKYCForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { profileData, fetchProfileData } = useStore();
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userIdvStatus, setUserIdvStatus] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [hasPaidForVerification, setHasPaidForVerification] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const navigate = useNavigate();


  console.log("hasPaidForVerification",hasPaidForVerification)

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data only if it's not available
    }
  }, [profileData, fetchProfileData]);

  useEffect(() => {
    if (profileData?.hasPaidForVerification !== undefined) {
      setHasPaidForVerification(profileData.hasPaidForVerification);
    }
  }, [profileData]);

  const getAuthToken = () => {
    return localStorage.getItem('userToken') || ''; 
  };
  

  const fetchLinkToken = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        toast.error("User ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/plaid/generate_link_token_for_idv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch link token: ${response.statusText}`);
      }

      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error("Error fetching link token:", error);
      toast.error("Failed to fetch Plaid link token. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const startPaymentProcess = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/payment/create-payment-intent`,
        { amount: 1000, currency: "usd" },
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

 
const handlePaymentSuccess = async () => {
  try {
    const response = await updateStatusForIdentityPayment();
    
    
    if (response?.success) {
      toast.success("Payment successful! You can now proceed with Identity verification.");
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

  const retryIdentityVerification = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const token = getAuthToken()
      const response = await fetch(`${BASE_URL}/plaid/retry-idv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_user_id: String(userId), // Use the userId as the client_user_id
        }),
      });
  
      const data = await response.json();
      console.log("status......",data.data.status)
      setUserIdvStatus(data.data.status)
  
      if (data?.message === "Identity verification retry initiated successfully") {
        setUserIdvStatus(data?.data.status)
        console.log("Retry successful:", data);
        return data; // Return the response for further use
      } else {
        console.error("Failed to retry identity verification:", data.message || "Unknown error");
        return null;
      }
    } catch (error) {
      console.error("Error retrying identity verification:", error);
      return null;
    }
  };
  
  const getIdvStatusOfUser = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const token = getAuthToken()
      const response = await fetch(`${BASE_URL}/plaid/user-idvStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: String(userId),  
        }),
      });
  
      const data = await response.json();
      console.log(data?.data)
      setUserIdvStatus(data?.data?.plaid_idv_status)
    } catch (error) {
      console.error("Error retrying identity verification:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchLinkToken();
    getIdvStatusOfUser()
  }, [userIdvStatus]);

  const tellServerUserIsDoneWithIDV = async (metadata) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/plaid/idv_complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          metadata,
        }),
      });
  
      if (!response.ok) {
        retryIdentityVerification();
        setUserIdvStatus("failed");
        throw new Error("Failed to complete IDV.");
      }

      const data = await response.json();
        retryIdentityVerification()
      // toast.success("Identity verification completed successfully!");
      // if(data.message == "User already verified."){
      // setUserIdvStatus("success")
      // }
      
    } catch (error) {
      console.error("Error completing IDV:", error.message || error);
      // toast.error(error.message || "Failed to complete Identity Verification.");
    }
  };

  const startLinkIDV = async () => {
    if (!linkToken) {
      toast.error("Link token is not available. Please refresh the page.");
      return;
    }

    if (!window.Plaid) {
      toast.error("Plaid SDK is not loaded. Please refresh the page.");
      return;
    }

    const handler = window.Plaid.create({
      token: linkToken,
      onSuccess: async (publicToken, metadata) => {
        console.log("Finished with IDV:", metadata);
        await tellServerUserIsDoneWithIDV(metadata);
      },
      onExit: async (err, metadata) => {
        // retryIdentityVerification()
        if (err) {
          toast.error("Identity Verification exited prematurely.");
        }
      },
    });

    handler.open();
  };

  const handleStartVerification = () => {
    
      startLinkIDV() // Directly start IDV
  
  };

  return (
    <>
    <Elements stripe={stripePromise} options={clientSecret ? { clientSecret } : null}>
    <div className="flex justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col">
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
              Kyc Profile
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
        </div>
        { !loading ?      <div className=" p-4 m-5 font-sans bg-[#5EB66E1A] rounded-lg font-normal text-[16px] text-[#646464] mb-4 text-left">
        To comply with financial regulations, we require you to complete
        the KYC verification process. This helps ensure the security and
        integrity of our platform.
      </div> : null}
        {/* Button Section */}
        <div className="flex flex-col justify-center items-center flex-grow">
          {loading ? (
            <Loader />
          ) : (
            <button
              className="px-4 py-2 bg-[#5EB66E] text-white rounded disabled:opacity-50"
              onClick={handleStartVerification}
              disabled={!linkToken || loading} // || userIdvStatus === "success" disable when user status is success
            >
              {["failed", "incomplete", "active", "success", "undefined"].includes(userIdvStatus)
                ? "Restart Identity Verification"
                : 
                 "Start Identity Verification"
                }

                      </button>
                    )}
        </div>
        <div className="p-4">
          <button
            onClick={() => {
              navigate('/bank-details');
            }}
            disabled={["failed", "incomplete",undefined].includes(userIdvStatus)}
            className={`font-sans w-full bg-[#5EB66E] text-[#ffff] py-3 text-[16px] font-semibold rounded-md  focus:outline-none focus:ring-2  ${
              ["failed", "incomplete",undefined].includes(userIdvStatus)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state
                : "bg-[#5EB66E] text-white"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
    {/* Payment Prompt Modal */}
    {/* {showPaymentPrompt && (
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
            <CheckoutForm onSuccess={handlePaymentSuccess} onClose={() => setShowPaymentModal(false)} />
          )}
        </Elements>
      )} */}
     <ToastContainer position="top-center" autoClose={2000} />
    </Elements>
    </>
  );
};

export default ProfileKYCForm;
