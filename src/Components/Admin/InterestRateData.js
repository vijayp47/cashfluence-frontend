import React, { useState, useEffect } from "react";
import { getDataFromDatabaseAdmin } from "../../API/apiServices";

const UserScoreDataDisplay = ({userId}) => {
 
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    fetchInfluencerData(userId);
  }, []);

  const fetchInfluencerData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await getDataFromDatabaseAdmin({ userId });
      const profileData = response?.accountData;
      setInfluencerProfile(profileData);


      console.log("profileData",profileData);
      
      if (profileData) {
        if (profileData?.instagram_data) {
          setActiveTab("Instagram");
        } else if (profileData?.tiktok_data) {
          setActiveTab("TikTok");
        } else if (profileData?.youtube_data) {
          setActiveTab("YouTube");
        }
      }
      const calculatedScore = calculateInfluencerScore(profileData);
      setScore(calculatedScore.toFixed(2));
    } catch (error) {
      console.error("Error fetching influencer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEngagementRate = (data) => {
    console.log("data------------", data?.follower_count);

    if (data && data?.subscriber_count !== null ?  data?.subscriber_count : data?.follower_count) {
      const totalEngagements =
        (data?.average_like_count || 0) +
        (data?.average_comment_count || 0) +
        (data?.average_share_count || 0);
      const count = data?.subscriber_count !== null ?  data?.subscriber_count : data?.follower_count;
      console.log("count---u tube ", count);
console.log("totalEngagements",totalEngagements);

      // If there's no count, return 0
      if (!count) return 0;

      return (totalEngagements / count) * 100; // Return engagement as a percentage
    }
    return 0; // Return 0 if no data
  };

  const calculatePlatformEngagementRate = (platformData) => {
    return calculateEngagementRate(platformData);
  };


  console.log("influencerProfile",influencerProfile);
  
  const engagementRates = [
    calculatePlatformEngagementRate(influencerProfile?.instagram_data),
    calculatePlatformEngagementRate(influencerProfile?.youtube_data),
    calculatePlatformEngagementRate(influencerProfile?.tiktok_data),
  ];
  const totalEngagementRate = engagementRates
    .filter((rate) => rate !== null)
    .reduce((acc, rate) => acc + rate, 0);

  const engagementRate = totalEngagementRate / engagementRates.length;

  const calculateInfluencerScore = (data) => {
    if (!data) return 0;
    const engagementRate = calculateEngagementRate(data?.instagram_data || {});
    return engagementRate * 0.1;
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if ((!influencerProfile?.instagram_data) && (!influencerProfile?.youtube_data) && (!influencerProfile?.tiktok_data))
  // if (!influencerProfile)
    return <div className="text-center py-4">No data available</div>;

  const socialAccounts = [
    influencerProfile?.instagram_data && "Instagram",
    influencerProfile?.tiktok_data && "TikTok",
    influencerProfile?.youtube_data && "YouTube",
  ].filter(Boolean);

  const getPlatformDiversity = (platform) => {
    const platformData = influencerProfile?.platforms.find(
      (p) => p.name.toLowerCase() === platform.toLowerCase()
    );
    return platformData?.products?.activity ? "Active" : "Inactive";
  };

  const getIntervalData = (incomePayoutInterval) => {
    switch (incomePayoutInterval) {
      case "AUTOMATIC_DAILY":
        return "Automatic Daily"; // Highest score
      case "AUTOMATIC_WEEKLY":
        return "Automatic Weekly";
      case "AUTOMATIC_MONTHLY":
        return "Automatic Monthly";
      default:
        return "N/A"; // Low consistency if no payout interval is defined
    }
  };

  const renderAccountData = (platform) => {
    const data = influencerProfile[`${platform.toLowerCase()}_data`];
    console.log("platform", platform);
    if (!data)
      return <p className="text-center">No data available for {platform}</p>;
  
    return (
      <div className="font-sans bg-white p-5 rounded-lg shadow border text-left border-[#C4C4C4] mt-4">
        <h2 className="font-sans text-[24px] text-[#383838] font-extrabold mb-4">
          {platform} Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FCFCFC] w-full p-4 gap-y-4">
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Avg. Likes:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {data?.average_like_count ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Avg. Shares:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {data?.average_share_count ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Avg. Comments:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {data?.average_comment_count ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              {platform === "YouTube" ? "Subscriber:" : "Followers:"}
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {platform === "YouTube"
                ? data?.subscriber_count ?? "N/A"
                : data?.follower_count ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Engagement Rate:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {data ? calculateEngagementRate(data).toFixed(2) : "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Content Quality Score:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {data?.average_content_quality_score ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Platform Diversity:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {getPlatformDiversity(platform) ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-normal text-[16px] text-[#646464]">
              Income:
            </span>
            <span
              className="font-sans font-semibold text-[18px] text-[#383838] break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {getIntervalData(data?.income_payout_interval) ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  };
  

  return (

    <> {socialAccounts.map((platform) => (
      <button
        key={platform}
        onClick={() => setActiveTab(platform)}
        className={`px-4 py-2 mr-3 rounded-lg ${
          activeTab === platform
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {platform}
      </button>
      
    ))}   {activeTab && renderAccountData(activeTab)}</>
   
  );
};

export default UserScoreDataDisplay;
