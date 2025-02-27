
import { create } from 'zustand';
import { getDataFromDatabase } from "../../API/apiServices";

// Define weights for components
const weights = {
  engagementRate: 0.1, // 10%
  incomeConsistency: 0.05, // 5%
  platformDiversity: 0.05, // 5%
  contentQuality: 0.10, // 10%
};

const useInfluencerStore = create((set) => ({
  userId: localStorage.getItem("userId") || "",  // If no userId in localStorage, default to empty string
  influencerProfile: null,
  score: 0,
  isLoading: false,

  // Action to set the influencer profile data
  setInfluencerProfile: (data) => set({ influencerProfile: data }),

  // Action to set the influencer score
  setInfluencerScore: (score) => set({ score }),

  // Action to fetch influencer data
  fetchInfluencerProfile: async (userId) => {
    if (!userId) {
      console.error("userId is required to fetch influencer profile.");
      return; // Exit early if no userId is found
    }

    set({ isLoading: true });

    try {
      const response = await getDataFromDatabase({ userId });

      // Set influencer profile data in the store
      set({ influencerProfile: response?.accountData });

      // Calculate the influencer score
      const calculatedScore = calculateInfluencerScore(response?.accountData);

      // Set the influencer score in the store
      set({ score: calculatedScore.toFixed(2) });

     

    } catch (error) {
      console.error("Error fetching influencer data:", error);
      set({ isLoading: false });
      // Handle the error, show an alert or error message
    }
  },
}));

// Calculate Engagement Rate
const calculateEngagementRate = (data) => {
  if (data && data?.subscriber_count !== null ?  data?.subscriber_count : data?.follower_count) {
    const totalEngagements =
      (data?.average_like_count || 0) +
      (data?.average_comment_count || 0) +
      (data?.average_share_count || 0);
    const count = data?.subscriber_count !== null ?  data?.subscriber_count : data?.follower_count;
  

    // If there's no count, return 0
    if (!count) return 0;

    return (totalEngagements / count) * 100; // Return engagement as a percentage
  }
  return 0; // Return 0 if no data
};


// Calculate Income Consistency based on payout interval
const calculateIncomeConsistency = (incomePayoutInterval) => {
  switch (incomePayoutInterval) {
    case "AUTOMATIC_DAILY":
      return 1.0; // Highest score
    case "AUTOMATIC_WEEKLY":
      return 0.8;
    case "AUTOMATIC_MONTHLY":
      return 0.5;
    default:
      return 0.3; // Low consistency if no payout interval is defined
  }
};

// Calculate Platform Diversity
const calculatePlatformDiversity = (platforms) => {
  return platforms.filter((platform) => platform.products.income === true && platform.products.activity === true).length;
};

// Calculate the final influencer score
const calculateInfluencerScore = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return 0;
  }

  // Extract data for TikTok, Instagram, YouTube, and platforms
  const { instagram_data, youtube_data, tiktok_data, platforms } = data;

  // Step 1: Calculate Engagement Rate for each platform (TikTok, Instagram, YouTube)
  const calculatePlatformEngagementRate = (platformData) => {
    return calculateEngagementRate(platformData);
  };

  const engagementRates = [
    calculatePlatformEngagementRate(instagram_data),
    calculatePlatformEngagementRate(youtube_data),
    calculatePlatformEngagementRate(tiktok_data)
  ];

  // Calculate total engagement rate across available platforms
  const totalEngagementRate = engagementRates.filter(rate => rate !== null).reduce((acc, rate) => acc + rate, 0);
  const engagementRate = totalEngagementRate / engagementRates.length;

  // Step 2: Calculate Income Consistency (use the payout interval for each platform with income)
  const incomeConsistencyScores = platforms.map(platform => {
    if (platform.products.income) {
      return calculateIncomeConsistency(platform.income_payout_interval);
    }
    return 0; // If no income, score is 0
  });

  // Calculate average income consistency across active platforms
  const incomeConsistency = incomeConsistencyScores.reduce((acc, score) => acc + score, 0) / incomeConsistencyScores.length;

  // Step 3: Calculate Platform Diversity (count active platforms with income or activity)
  const platformDiversity = calculatePlatformDiversity(platforms);

  // Step 4: Calculate Content Quality (use the average content quality score for each platform)
  const contentQualityScores = [
    instagram_data?.average_content_quality_score ?? 0, // Default to 0 if null or undefined
    youtube_data?.average_content_quality_score ?? 0, // Default to 0 if null or undefined
    tiktok_data?.average_content_quality_score ?? 0  // Default to 0 if null or undefined
  ];

  // Filter out null/undefined values and calculate the average score
  const validContentQualityScores = contentQualityScores.filter(score => score !== null);

  // Calculate the average content quality score across available platforms
  const contentQuality = validContentQualityScores.length > 0 
    ? validContentQualityScores.reduce((acc, score) => acc + score, 0) / validContentQualityScores.length
    : 0; // If no valid scores, set to 0

  // Step 5: Apply weights and calculate total influencer score
  const influencerScore = 
    (engagementRate * weights.engagementRate) +
    (incomeConsistency * weights.incomeConsistency) +
    (platformDiversity * weights.platformDiversity) +
    (contentQuality * weights.contentQuality);

  return influencerScore;
};

export default useInfluencerStore;
