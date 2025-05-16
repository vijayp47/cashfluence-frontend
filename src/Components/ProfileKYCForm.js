import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import useStore from "./store/userProfileStore";
import Loader from "./Loader";
import CheckoutForm from "../../src/Components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { updateStatusForIdentityPayment } from "../API/apiServices";
import TransactionHistory from "./TransactionHistory";
const stripePromise = loadStripe(
  "pk_test_51PnDYCHJvnanatbhqplAFXJaRmLHiZf225u3hQ4FL3AcN5ear6ZZsggNWieJcHnf5pacaIYT3gB2k2ti0LsWOyRo00dEmBlxTO"
);

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
  const [sessionId, setSessionId] = useState(null);

  const navigate = useNavigate();

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
    return localStorage.getItem("userToken") || "";
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

      const response = await fetch(
        `${BASE_URL}/plaid/generate_link_token_for_idv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

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

  const retryIdentityVerification = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/plaid/retry-idv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_user_id: String(userId), // Use the userId as the client_user_id
        }),
      });

      const data = await response.json();

      setUserIdvStatus(data.data.status);

      if (
        data?.message === "Identity verification retry initiated successfully"
      ) {
        setUserIdvStatus(data?.data.status);
        console.log("Retry successful:", data);
        return data; // Return the response for further use
      } else {
        console.error(
          "Failed to retry identity verification:",
          data.message || "Unknown error"
        );
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
      const token = getAuthToken();
      const response = await fetch(`${BASE_URL}/plaid/user-idvStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: String(userId),
        }),
      });

      const data = await response.json();
    
      setUserIdvStatus(data?.data?.plaid_idv_status);
    } catch (error) {
      console.error("Error retrying identity verification:", error);
      return null;
    }
  };

  const orgKeywords = [
    "inc",
    "inc.",
    "llc",
    "ltd",
    "ltd.",
    "plc",
    "corp",
    "corporation",
    "co",
    "co.",
    "company",
    "organization",
    "organisation",
    "enterprise",
    "group",
    "trust",
    "foundation",
    "associates",
    "partners",
    "partnership",
    "gmbh",
    "s.a.",
    "s.a",
    "sarl",
    "bv",
    "oy",
    "pte",
    "sdn bhd",
    "solutions",
    "pvt",
    "pvt. ltd",
    "private limited",
    "ug",
    "ag",
    "sas",
    "sa",
    "srl",
    "sl",
    "nv",
    "ab",
    "ltda",
    "ulc",
  ];
  const isOrganization = (() => {
    const Idvdata = profileData?.idvDetails; // update if actual key is different
    const legalName =
      Idvdata?.regulatory_details?.search_terms?.legal_name?.toLowerCase() ||
      "";
    const extractedName =
      Idvdata?.documentary_verification?.[0]?.extracted_data?.name;
    const extractedFullName = `${extractedName?.given_name || ""} ${
      extractedName?.family_name || ""
    }`.toLowerCase();
    const fullName = `${Idvdata?.first_name || ""} ${
      Idvdata?.last_name || ""
    }`.toLowerCase();

    const allNames = [legalName, extractedFullName, fullName];

    return allNames.some((name) =>
      orgKeywords.some((keyword) => name.includes(keyword))
    );
  })();

  useEffect(() => {
    fetchLinkToken();
  }, []);

  useEffect(() => {
    getIdvStatusOfUser();
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

      retryIdentityVerification();
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
        if (err && !isOrganization) {
          toast.error("Identity Verification exited prematurely.");
        }
      },
    });

    handler.open();
  };
  const handleStartVerification = () => {
    if (isOrganization) {
      toast.error(
        "Organizations are not allowed to apply. Please use an individual name."
      );
      return;
    }

    startLinkIDV();
  };
  return (
    <>
      <Elements
        stripe={stripePromise}
        options={clientSecret ? { clientSecret } : null}
      >
        <div className="flex justify-center min-h-screen">
          <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col">
            {/* Header */}

            {sessionId && (
              <div>
                <h3>Session Created!</h3>
                <p>Session ID: {sessionId}</p>

                {/* ✅ Pass sessionId to RegulatoryRequirements component */}
                <TransactionHistory sessionId={sessionId} />
              </div>
            )}
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
            {!loading ? (
              <div className="p-4 m-5 font-sans bg-[#5EB66E1A] rounded-lg font-normal text-[16px] text-[#646464] mb-4 text-left flex justify-center items-center">
                <div className="text-center">
                  ✨ *Let’s Quickly Get You Verified!* ✨ <br />
                  We just need a few details to keep everything safe, secure,
                  and super smooth for you. Completing KYC helps us protect your
                  account and ensure you're ready to unlock funds that fuel your
                  influencer goals.
                </div>
              </div>
            ) : null}
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
                  {[
                    "failed",
                    "incomplete",
                    "active",
                    "success",
                    "undefined",
                  ].includes(userIdvStatus)
                    ? "Restart Identity Verification"
                    : "Start Identity Verification"}
                </button>
              )}
            </div>
            <div className="p-4">
              <button
                onClick={() => {
                  navigate("/bank-details");
                }}
                disabled={["failed", "incomplete", undefined].includes(
                  userIdvStatus
                )}
                className={`font-sans w-full bg-[#5EB66E] text-[#ffff] py-3 text-[16px] font-semibold rounded-md  focus:outline-none focus:ring-2  ${
                  ["failed", "incomplete", undefined].includes(userIdvStatus)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state
                    : "bg-[#5EB66E] text-white"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
      </Elements>
    </>
  );
};

export default ProfileKYCForm;
