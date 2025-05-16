import React, { useState, useEffect } from "react";
import { getDataFromDatabaseAdmin } from "../../API/apiServices";

const UserScoreDataDisplay = ({ userId }) => {
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for storing the selected user's details

  useEffect(() => {
    fetchInfluencerData(userId);
  }, [userId]);

  const fetchInfluencerData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await getDataFromDatabaseAdmin({ userId });
      const profileData = response?.accountData;
    
      setInfluencerProfile(profileData);
      setActiveTab("Instagram"); // Default active tab

      const calculatedScore = calculateInfluencerScore(profileData);
      setScore(calculatedScore.toFixed(2));
    } catch (error) {
      console.error("Error fetching influencer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEngagementRate = (data) => {
if (data && (data?.subscriber_count || data?.follower_count)) {
      const totalEngagements =
        (data?.average_like_count || 0) +
        (data?.average_comment_count || 0) +
        (data?.average_share_count || 0);
      const count = data?.subscriber_count || data?.follower_count;

      if (!count) return 0;

      return (totalEngagements / count) * 100;
    }
    return 0; // Return 0 if no data
  };


  const calculateInfluencerScore = (data) => {
    
    if (!data) return 0;
    return calculateEngagementRate(data?.instagram_data || {}) * 0.1;
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  const socialAccounts = [
    influencerProfile?.instagram_data && "Instagram",
    influencerProfile?.tiktok_data && "TikTok",
    influencerProfile?.youtube_data && "YouTube",
  ].filter(Boolean);

  const handleUserClick = (platform, username) => {
    const platformData = influencerProfile[`${platform.toLowerCase()}_data`];
    const selectedUserData = platformData?.find((user) => user.username === username);
  
    // Get statuses from platform.accounts
    const matchingPlatform = influencerProfile?.platforms?.find(
      (p) => p.platform_name.toLowerCase() === platform.toLowerCase()
    );
  
    const statusData = matchingPlatform?.accounts?.find((acc) => acc.username === username);
  
    // Merge status data with selected user
    const mergedData = { ...selectedUserData, ...statusData };
  
    setSelectedUser(mergedData);
  };
  

  const renderAccountData = (platform) => {
    const data = influencerProfile[`${platform.toLowerCase()}_data`];
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return <p className="text-center">No data available for {platform}</p>;
    }

    return (
      <div className="font-sans bg-white p-5 rounded-lg shadow border text-left border-[#C4C4C4] mt-4">
        <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
          {platform} Accounts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(data)
            ? data.map((user, index) => (
                <div
                  key={index}
                  className="bg-[#F4F4F4] p-4 rounded-lg shadow-lg mb-4 cursor-pointer hover:bg-[#E2E2E2] transition-colors"
                  onClick={() => handleUserClick(platform, user.username)}
                >
                  <span className="font-semibold text-[#383838]">{user.username}</span>
                </div>
              ))
            : null}
        </div>
      </div>
    );
  };

  const renderUserData = () => {
    if (!selectedUser) return <div className="text-center">Select a user to see details</div>;

    return (
      <div className="font-sans bg-white p-5 rounded-lg shadow border text-left border-[#C4C4C4] mt-4">
        <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
          {selectedUser.username} Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFCFC] w-full p-4 gap-y-4">
          {[ 
            { label: "Avg. Likes:", value: selectedUser?.average_like_count ?? "N/A" },
            { label: "Avg. Shares:", value: selectedUser?.average_share_count ?? "N/A" },
            { label: "Avg. Comments:", value: selectedUser?.average_comment_count ?? "N/A" },
            {
              label: activeTab === "Instagram" ? "Followers:" : activeTab === "YouTube" ? "Subscriber:" : "Followers:",
              value: activeTab === "Instagram" 
                ? selectedUser?.follower_count ?? "N/A"
                : activeTab === "YouTube"
                ? selectedUser?.subscriber_count ?? "N/A"
                : selectedUser?.follower_count ?? "N/A"
            },
            { label: "Engagement Rate:", value: calculateEngagementRate(selectedUser)?.toFixed(2) + `%` ?? "N/A" },
            { label: "Content Quality Score:", value: selectedUser?.average_content_quality_score ?? "N/A" },
            { label: "Is Business:", value: selectedUser?.is_business ? "true" : "false" },
            { label: "Income:", value: selectedUser?.income_payout_interval ?? "N/A" },
            { label: "Audience Status:", value: selectedUser?.audience_status ?? "N/A" },
            { label: "Identity Status:", value: selectedUser?.identity_status ?? "N/A" },
            { label: "Engagement Status:", value: selectedUser?.engagement_status ?? "N/A" },
          ].map((item, index) => (
            <div key={index} className="flex flex-row md:flex-col justify-between md:justify-start">
              <span className="font-sans font-normal text-[16px] text-[#646464]">{item.label}</span>
              <span className="font-sans font-semibold text-[18px] text-[#383838] break-words md:mt-1">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-x-4">
        {socialAccounts.map((platform) => (
          <button
            key={platform}
            onClick={() => setActiveTab(platform)}
            className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-300 ${
              activeTab === platform
                ? "bg-[#5EB66E] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-[#469F5E]"
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {activeTab && renderAccountData(activeTab)}
      {renderUserData()}
    </>
  );
};

export default UserScoreDataDisplay;
