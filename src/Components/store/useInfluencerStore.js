import { create } from 'zustand';
import { getDataFromDatabase, getWeightConfig } from "../../API/apiServices";

// Helper function to calculate average engagement rate for multiple accounts
const calculatePlatformEngagementRate = (accounts) => {
  if (!accounts || accounts.length === 0) return 0;

  const validRates = accounts.map(account => {
    const totalEngagements =
      (account?.average_like_count || 0) +
      (account?.average_comment_count || 0) +
      (account?.average_share_count || 0);
    
    const count = account?.subscriber_count !== null ? account?.subscriber_count : account?.follower_count;
    
    if (!count) return 0;
    return (totalEngagements / count) * 100;
  });

  return validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length;
};

// Calculate average content quality for multiple accounts
const calculateAverageContentQuality = (accounts) => {
  if (!accounts || accounts.length === 0) return 0;
  
  const validScores = accounts
    .map(account => account?.average_content_quality_score ?? 0)
    .filter(score => score !== null && score !== 0);

  return validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length 
    : 0;
};


// Helper function to calculate points based on SYNCED status
const calculateSyncPoints = (account) => {
  const statuses = [
    account.income_status,
    account.audience_status,
    account.identity_status,
    account.engagement_status
  ];

  // Count the number of 'SYNCED' statuses
  const syncCount = statuses.filter(status => status === 'SYNCED').length;

  // Assign points based on the number of 'SYNCED' statuses
  return syncCount; // Points will be between 0 and 4 (1 for each SYNCED status)
};

// Updated Platform Diversity Calculation
const calculatePlatformDiversity = (platforms) => {
  return platforms.reduce((acc, platform) => {
    const activeAccounts = platform.accounts.filter(account =>
      account.income_status === 'SYNCED' && account.identity_status === 'SYNCED' &&
      account.audience_status === 'SYNCED' && account.engagement_status === 'SYNCED'
    );

    if (activeAccounts.length > 0) {
      const totalPoints = activeAccounts.reduce((sum, account) => {
        const points = calculateSyncPoints(account); // Get points for the account
        return sum + points;
      }, 0);

      const averagePoints = totalPoints / activeAccounts.length; // Calculate average points for this platform
      console.log(`Platform: ${platform.platform_name}, Average Points: ${averagePoints}`); // Debug log
      return acc + averagePoints;
    }
    return acc;
  }, 0);
};

// Updated Income Consistency Calculation to check income_status
const calculateIncomeConsistency = (platforms) => {
  if (!platforms || platforms.length === 0) return 0;
  
  // Filter platforms that have income in products and have accounts with SYNCED income_status
  const platformsWithSyncedIncome = platforms.filter(platform => {
    // Check if platform has income product
    const hasIncomeProduct = platform.products.includes('income');
    if (!hasIncomeProduct) return false;

    // Check if any accounts have SYNCED income_status
    const hasSyncedIncomeAccounts = platform.accounts.some(
      account => account.income_status === 'SYNCED'
    );
    
    return hasSyncedIncomeAccounts;
  });
  
  if (platformsWithSyncedIncome.length === 0) return 0;
  
  // Calculate score based on platforms with synced income data
  const incomeConsistencyScores = platformsWithSyncedIncome.map(() => 0.8);
  
  return incomeConsistencyScores.reduce((sum, score) => sum + score, 0) / incomeConsistencyScores.length;
};

const calculateInfluencerScore = (data, weights) => {
  if (!data || Object.keys(data).length === 0) return 0;

  // Calculate engagement rates for each platform's accounts
  const instagramEngagement = calculatePlatformEngagementRate(data?.instagram_data || []);
  const youtubeEngagement = calculatePlatformEngagementRate(data?.youtube_data || []);
  const tiktokEngagement = calculatePlatformEngagementRate(data?.tiktok_data || []);

  // Average engagement rate across all platforms with active accounts
  const activeEngagementPlatforms = [
    data?.instagram_data?.length && instagramEngagement,
    data?.youtube_data?.length && youtubeEngagement,
    data?.tiktok_data?.length && tiktokEngagement
  ].filter(Boolean).length;

  const totalEngagementRate = (instagramEngagement + youtubeEngagement + tiktokEngagement) / 
    (activeEngagementPlatforms || 1);

  // Calculate income consistency using the updated function
  const incomeConsistency = calculateIncomeConsistency(data.platforms);

  // Calculate platform diversity (number of platforms with active accounts)
  const platformDiversity = calculatePlatformDiversity(data.platforms);

  // Calculate average content quality across all platforms
  const contentQualityScores = {
    instagram: calculateAverageContentQuality(data.instagram_data || []),
    youtube: calculateAverageContentQuality(data.youtube_data || []),
    tiktok: calculateAverageContentQuality(data.tiktok_data || [])
  };

  const activePlatforms = Object.values(contentQualityScores).filter(score => score > 0).length;
  const averageContentQuality = Object.values(contentQualityScores)
    .reduce((sum, score) => sum + score, 0) / (activePlatforms || 1);

  // Calculate final score with weights
  const influencerScore =
    (totalEngagementRate * (weights.engagementRate ?? 0.1)) +
    (incomeConsistency * (weights.incomeConsistency ?? 0.05)) +
    (platformDiversity * (weights.platformDiversity ?? 0.05)) +
    (averageContentQuality * (weights.contentQuality ?? 0.1));

  return influencerScore;
};

const useInfluencerStore = create((set) => ({
  userId: localStorage.getItem("userId") || "",
  influencerProfile: null,
  score: 0,
  isLoading: false,
  weights: {
    engagementRate: 0.1,
    incomeConsistency: 0.05,
    platformDiversity: 0.05,
    contentQuality: 0.10,
  },

  setInfluencerProfile: (data) => set({ influencerProfile: data }),
  setInfluencerScore: (score) => set({ score }),
  setWeights: (weights) => set({ weights }),

  fetchInfluencerProfile: async (userId) => {
    if (!userId) {
      console.error("userId is required to fetch influencer profile.");
      return;
    }

    set({ isLoading: true });

    try {
      const response = await getDataFromDatabase({ userId });
      const weightRes = await getWeightConfig();
      const rawWeights = weightRes.influencerWeights;
      const dynamicWeights = {
        engagementRate: rawWeights.engagementRate / 100,
        incomeConsistency: rawWeights.incomeConsistency / 100,
        platformDiversity: rawWeights.platformDiversity / 100,
        contentQuality: rawWeights.contentQuality / 100,
      };

      set({ influencerProfile: response?.accountData });
      set({ weights: dynamicWeights });

      const calculatedScore = calculateInfluencerScore(response?.accountData, dynamicWeights);
      set({ score: calculatedScore.toFixed(2), isLoading: false });
    } catch (error) {
      console.error("Error fetching influencer data:", error);
      set({ isLoading: false });
    }
  },
}));

export default useInfluencerStore;


