import React, { useState, useEffect } from "react";
import verify from "../assets/images/verify.png";
import { useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  createPhylloUser,
  createSDKtoken,
  getPlatFormNameAndId,
  getSocialAccount,
  getDataFromDatabase,
  deletePlatformDataFromDatabase,fetchLiabilities
} from "../API/apiServices";
import useScoreStore from "./store/useInfluencerStore";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";
import useStore from "./store/userProfileStore"; 
import useInfluencerStore from "./store/useInfluencerStore";

const clientDisplayName = process.env.REACT_APP_CLIENT_DISPLAY_NAME;
const environment = process.env.REACT_APP_ENVIRONMENT;

const ConnectAccounts = () => {
  const navigate = useNavigate();
  const [loadingPlatform, setLoadingPlatform] = useState(null);
  const [userId, setUserId] = useState(null);
  const [platformLoading, setPlatformLoading] = useState(false); // State for platform-related loading
  const [token, setToken] = useState();
  const [platforms, setPlatforms] = useState([]);
  const [dataFetch, setDataFetch] = useState(false);
  const [liabilities, setLiabilities] = useState(null); // Store response
  const { profileData, fetchProfileData } = useStore();
  const { influencerProfile, score, isLoading, fetchInfluencerProfile } = useInfluencerStore();
console.log("score",score);

  useEffect(() => {
    if (!profileData) {
      fetchProfileData(); // Fetch data if not already present
    }
  }, [profileData, fetchProfileData]);

 
  useEffect(() => {
    let isComponentMounted = true;

    const createUser = async () => {
      try {
        setPlatformLoading(true);

        const existingUserId = localStorage.getItem("userId");

        // If user already exists, skip the API call
        if (existingUserId) {
          setUserId(existingUserId);

          if (isComponentMounted) {
            const sdkToken = await createSDKtoken();
            setToken(sdkToken.sdk_token);

            const platformData = await getPlatFormNameAndId();
            setPlatforms(platformData);
          }

          setPlatformLoading(false);
          return;
        }

        const userData = await createPhylloUser();
        const newUserId = userData.user_id;
        localStorage.setItem("userId", newUserId);
        setUserId(newUserId);

        if (isComponentMounted) {
          const sdkToken = await createSDKtoken();

          setToken(sdkToken.sdk_token);

          const platformData = await getPlatFormNameAndId();
          setPlatforms(platformData);
        }

        setPlatformLoading(false);
      } catch (error) {
        console.error("Error creating Phyllo user:", error);
        setPlatformLoading(false);
      }
    };

    if (isComponentMounted) {
      createUser();
    }

    return () => {
      isComponentMounted = false; // Cleanup to prevent duplicate calls
    };
  }, []); // Ensure an empty dependency array
const initializePhyllo = async (platformName, workPlatformId) => {

    if (window.PhylloConnect) {
      try {
        const config = {
          clientDisplayName,
          environment,
          userId,
          token,
          workPlatformId,
        };

        const phylloInstance = window.PhylloConnect.initialize(config);
      // Step 1: Register event listeners before opening the UI
        phylloInstance.on(
          "accountConnected",
          async (accountId, workPlatformId, metadata) => {
            // Proceed if account does not exist

          
            setLoadingPlatform(null);

            // Notify the user of successful connection
            Swal.fire(
              "Connected!",
              `Successfully connected to ${platformName}. Fetching account data...`,
              "success"
            );

            try {
              // Fetch social account data
              const socialAccountData = await getSocialAccount({
                workPlatformId,
                userId,
                limit: 10,
                offset: 0,
                platformName
              });


              Swal.fire(
                "Success!",
                `Successfully fetched account data for ${platformName}.`,
                "success"
              );
            } catch (error) {
              console.error("Error fetching social account data:", error);
              Swal.fire(
                "Error",
                `Failed to fetch account data for ${platformName}.`,
                "error"
              );
            }
          }
        );

        // Handle account disconnection
        phylloInstance.on(
          "accountDisconnected",
          async (accountId, workPlatformId, additionalData) => {
         
            // Deleting platform data from the database when the account is disconnected
            try {
              await deletePlatformDataFromDatabase({ userId, platformName });
              Swal.fire(
                "Disconnected!",
                `An account from ${platformName} has been disconnected, and its data has been deleted.`,
                "info"
              );
            } catch (error) {
              console.error(
                "Error deleting platform data from database:",
                error
              );
              Swal.fire(
                "Error",
                `Failed to delete the ${platformName} data from the database.`,
                "error"
              );
            }
          }
        );

        // Handle token expiration
        phylloInstance.on("tokenExpired", async (expiredToken, metadata) => {
      const newToken = await fetchNewToken();
          if (newToken) {
            phylloInstance.updateToken(newToken);
          } else {
            console.error("Failed to refresh token");
          }
        });

        // Handle user exiting the connection flow
        phylloInstance.on("exit", (reason, metadata) => {
        
          setLoadingPlatform(null);
        });

        // Handle connection failure
        phylloInstance.on(
          "connectionFailure",
          (errorCode, reason, metadata) => {
            console.error("Connection failure event:", {
              errorCode,
              reason,
              metadata,
            });
            setLoadingPlatform(null);

            Swal.fire(
              "Connection Failed",
              `Failed to connect to ${platformName}. Reason: ${
                reason || "Unknown"
              }`,
              "error"
            );
          }
        );

        // Open the PhylloConnect UI after event listeners are registered
        phylloInstance.open({ workPlatformId });
      } catch (error) {
        console.error("Error initializing PhylloConnect:", error);
        setLoadingPlatform(null);
      }
    } else {
      console.error("Phyllo SDK not loaded");
    }
  };

  const handleConnect = (platformName, workPlatformId) => {
    if (!workPlatformId || loadingPlatform === workPlatformId) return;
    setLoadingPlatform(workPlatformId);
    setTimeout(() => initializePhyllo(platformName, workPlatformId), 2000);
  };

  const fetchNewToken = async () => {
    try {
      const response = await fetch("/api/refresh-token");
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching new token:", error);
      return null;
    }
  };





const handleButtonClick = () => {
  setDataFetch(true);

  fetchInfluencerProfile(userId)
    .then((response) => {
      // Save the response data in state
      setTimeout(() => {
        setDataFetch(false);
        // Navigate to the "applyforloan" page with the interestRate in state
        navigate("/applyforloan");
      }, 2000);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Handle the error as needed, show alert or error message
    });
};
  return (
    <div className="flex justify-center min-h-screen font-sans">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md h-full min-h-screen flex flex-col">
        <div className="flex items-center p-4 border-b border-[#5EB66E1A] bg-white shadow-md">
          <button
            className="mr-4 text-[#383838]"
            onClick={() => navigate("/bank-details")}
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
            Connect Your Accounts
          </h1>
          <div className="ml-auto relative group">
            <button className="flex items-left" onClick={() => navigate('/profile')}>
            {profileData?.image ? <img src={profileData?.image} alt="Profile" className="w-8 h-8 rounded-full bg-[#000000]" /> : <FaUser size={25} className="text-[#383838]" />}
            </button>
            <span className="font-sans absolute top-[30px] right-0 w-max px-2 py-1 text-xs text-white bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </div>
        </div>

        <div className="p-4 bg-white flex-grow">
          <p className="text-[16px] text-[#646464] font-semibold mb-4 text-left">
            To calculate your social score for microloans, please connect your
            social media accounts.
          </p>

          {platformLoading ? (
            <Loader /> // Show loader while fetching platforms
          ) : (
            <div className="space-y-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleConnect(platform.name, platform.id)}
                  className="flex items-center justify-between w-full p-4 rounded-md bg-[#F8F8F8] text-[16px] text-[#1F274A]"
                >
                  <span>
                    {loadingPlatform === platform.id
                      ? `Connecting ${
                          platform.name === "X" ? "Twitter" : platform.name
                        }...`
                      : `Connect ${
                          platform.name === "X" ? "Twitter" : platform.name
                        }`}
                  </span>
                  <img src={verify} alt="Verify Icon" className="h-5 w-5" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 mt-auto">
          <button
          className={`w-full  py-3 text-[16px] font-semibold rounded-md hover:bg-[#469F5E] focus:outline-none ${
            platformLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state
              : "bg-[#5EB66E] text-white" // Enabled state
          }`}
            onClick={handleButtonClick}
            disabled={platformLoading}
         
          >
           {dataFetch ?  "Processing..." :  "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccounts;
