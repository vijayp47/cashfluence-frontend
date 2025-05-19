// apiService.js
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;  
// Update the base URL if needed
  // Retrieve the `userId` from local storage

  const getAuthToken = () => {
    return localStorage.getItem('userToken') || ''; // or you could extract from headers in case of server-side requests
  };
  
// Function to handle POST requests
export const postApi = async (endpoint, data) => {
  const token = getAuthToken() || endpoint.split('/').pop();

  const fullUrl = `${BASE_URL}${endpoint}`; 
  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined, // Include only if present
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  } catch (error) {
    throw new Error(error.message || 'Server error');
  }
};


export const adminpostApi = async (endpoint, data) => {
  const token = localStorage.getItem("adminToken"); // JWT token (if needed)
  const fullUrl = `${BASE_URL}${endpoint}`; // Construct the full URL


  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined, // Include only if present
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("API Response Error:", result.message || response.statusText);
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Fetch Error:", error.message); // Debug error details
    throw new Error(error.message || "Server error");
  }
};


// Function to handle GET requests
export const getApi = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  } catch (error) {
    throw new Error(error.message || 'Server error');
  }
};

export const createPhylloUser = async () => {
  let userId = localStorage.getItem("userId");
  let login_id = localStorage.getItem("user_id");
  const token = getAuthToken();
  if (!userId) {
    // Option 2: Generate a fallback userId if not present in localStorage
    userId = Date.now().toString();  // Generate a unique user ID based on the current timestamp
  
  }

  try {
    // Generate external_id using userId
    const external_id = `Cashfluence-${userId}`;

    // Make the API request
    const response = await axios.post(`${BASE_URL}/phyllo/create-user`, {
      external_id: external_id, // Send external_id as part of the request body
      login_id:login_id
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // Add token to the request headers
      }
    });

    return response.data.userData; // return the user object with `userData` property
  } catch (error) {
    console.error('Error creating Phyllo user:', error);
    throw error;
  }
};



export const createSDKtoken = async () => {
  const token = getAuthToken();
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }

    // Include `user_id` in the request body
    const response = await axios.post(`${BASE_URL}/phyllo/sdk-token`, {
      user_id: userId, // Pass the retrieved user ID
    }, {
      headers: {
        'Authorization': `Bearer ${token}` // Add token to the request headers
      }
    });
    return response.data; // Return the SDK token response
  } catch (error) {
    console.error("Error creating Phyllo SDK token:", error);
    throw error;
  }
};


export const fetchLoanDurations = async () => {
  const token = getAuthToken();

  try {
    if (!token) {
      throw new Error("Access token not found.");
    }

    const response = await axios.get(`${BASE_URL}/loans/loan-durations`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in headers
      }});
    return response.data.data; // Return only data
  } catch (error) {
    console.error("Error fetching loan durations:", error);
    return []; // Return empty array on error
  }
};

export const getRiskScore = async (accessTokensArray) => {
  const token = getAuthToken();

  try {
    if (!token) {
      throw new Error("Access token not found.");
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }

    // Use POST to send accessTokens in the request body
    const response = await axios.post(
      `${BASE_URL}/plaid/riskscore`, // Using POST method to send data in body
      { accessTokens: accessTokensArray, userId: userId,  }, // Body of the request
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching risk score:", error);
    throw error; // Throw the error to handle it elsewhere
  }
};



export const sendMessage = async (message) => {
  const token = getAuthToken();
  try {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }
    const response = await axios.post(`${BASE_URL}/auth/contact`, { message,userId }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include JWT token in headers
      },
    });
    return response.data; // Return the response data from the API
  } catch (error) {
    // Handle any error that occurs
    console.error("Error sending message:", error);
    throw error; // Throw error to be handled in the component
  }
};


export const disconnectAccountAndDeleteData = async (userId, platform, phylloAccountId, username) => {
  const token = getAuthToken();  // Get the token for authorization
  
  try {
    // Make the POST request to your back-end API endpoint
    const response = await axios.post(
      `${BASE_URL}/phyllo/remove-account`,  // Adjust the URL to your back-end route
      {
        userId,  // Send the necessary data in the body
        platform,
        phylloAccountId,
        username,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header with the token
        },
      }
    );

    return response.data;  // Return the response data (message or success)
  } catch (error) {
    console.error("Error disconnecting account and deleting data:", error);
    throw error;  // Propagate the error so it can be handled in the component
  }
};


export const getPlatFormNameAndId = async () => {
  const token = getAuthToken();
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/phyllo/platforms`, {
      params: { user_id: userId }, // Pass the user_id as a query parameter
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add token to the request headers
      }
    });
  
    return response?.data?.platforms; // Return the platform data
  } catch (error) {
    console.error('Error fetching Phyllo platforms:', error);
    throw error;
  }
};

export const getAccountData = async () => {
  const token = localStorage.getItem("userToken"); // Get the token from localStorage
  const userId = localStorage.getItem("user_id");
  // Check if token exists before making the request
  if (!token) {
    console.error("User token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/plaid/accountdata`, // The GET endpoint
      {
        params: { userId }, // Send userId as a query parameter
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send token in the Authorization header
        },
      }
    );
   
    // Check the response for success
    if (response?.data?.length > 0) {
      return response.data; // Return the data from the response
    } else {
      console.error(`Failed to fetch account data: ${response?.data?.message || "Unknown error"}`);
      throw new Error("Failed to fetch account data");
    }
  } catch (error) {
    console.error("Error while fetching account data:", error.response?.data || error.message);
    throw error; // Propagate the error for further handling
  }
};


export const getSocialAccount = async ({ workPlatformId, userId, limit = 10, offset = 0,platformName }) => {
  const token = getAuthToken();
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/phyllo/social/accounts`, {
      params: {
        user_id: userId,
        work_platform_id: workPlatformId,
        limit,
        offset,platformName
      },  
      headers: {
        'Authorization': `Bearer ${token}` // Add token to the request headers
      },
     
    });

    return response?.data; // Return the full response for flexibility
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    throw error;
  }
};

// This API will tell which platforms are connected for a user
export const getConnectedPlatforms = async (userId) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}/phyllo/connected-platforms/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Expected: { connectedPlatforms: ["Instagram", "YouTube"] }
  } catch (error) {
    console.error("Error fetching connected platforms:", error);
    return { connectedPlatforms: [] };
  }
};

// Fetch current weights
export const getWeightConfig = async () => {

  try {
    const response = await axios.get(`${BASE_URL}/weight/weights`, {
     
    });

    const data = response?.data;

    const influencerWeights = {
      engagementRate: data?.influencer_engagementRate ?? 10,
      incomeConsistency: data?.influencer_incomeConsistency ?? 5,
      platformDiversity: data?.influencer_platformDiversity ?? 5,
      contentQuality: data?.influencer_contentQuality ?? 10,
    };

    const rateWeights = {
      paymentHistory: data?.rate_paymentHistory ?? 40,
      influencerScore: data?.rate_influencerScore ?? 30,
    };

    return { influencerWeights, rateWeights }; // 👈 Return structured format
  } catch (error) {
    console.error("Error fetching weight config:", error);
    throw error;
  }
};


// Update weight config (admin only)
export const updateWeightConfig = async (updatedWeights) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  try {
    const response = await axios.put(`${BASE_URL}/weight/weights`, updatedWeights, {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is passed correctly
      },
    });

    return response?.data; // Return the updated config from backend
  } catch (error) {
    console.error("Error updating weight config:", error);
    throw error;
  }
};


export const getDataFromDatabase = async ({ userId }) => {
  const token = getAuthToken();
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/phyllo/fetchDataFromdatabase`, {
      params: {
        userId: userId,
    
       
      },   headers: {
        'Authorization': `Bearer ${token}` // Add token to the request headers
      },
     
    });

    return response?.data; // Return the full response for flexibility
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    throw error;
  }
};
export const getUserLoans = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const token = getAuthToken(); // Retrieve auth token
    if (!token) {
      throw new Error('Access token not found.');
    }

    const response = await axios.get(`${BASE_URL}/loans/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return loan data
  } catch (error) {
    console.error('Error fetching user loans:', error);
    throw error; // Propagate error
  }
};

export const checkLoanCompliance = async ({ state, loan_term, loan_amount, calculated_interest }) => {
  try {
    if (!state || !loan_term || !loan_amount || !calculated_interest) {
      throw new Error("All parameters are required.");
    }

    // Get the authorization token
    const token = getAuthToken();
    if (!token) {
      throw new Error("Access token not found.");
    }

    const response = await axios.get(`${BASE_URL}/loans/check-loan`, {
      params: {
        state,
        loan_term,
        loan_amount,
        calculated_interest,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Loan compliance check failed:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getDataFromDatabaseAdmin = async ({ userId }) => {
  const token = localStorage.getItem("adminToken");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/phyllo/fetchDataFromdatabaseadmin`, {
      params: {
        userId: userId,
       
      },   headers: {
        'Authorization': `Bearer ${token}` // Add token to the request headers
      },
     
    });

    return response?.data; // Return the full response for flexibility
  } catch (error) {
    console.error("Error fetching social accounts:", error);
    throw error;
  }
};
export const fetchUserRegistrations = async () => {
  const token = localStorage.getItem("adminToken"); 
  if (!token) {
    throw new Error("Admin token not found.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/user-registrations`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token for authentication
      },
    });

    return response?.data?.data || []; // Return only the data array
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
};

export const getDataForLoanGraphs = async () => {
  const token = localStorage.getItem("adminToken"); // Get token from localStorage
  
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/loan-graph`, {
      headers: {
        "Content-Type": "application/json", // Set Content-Type for the request
        Authorization: `Bearer ${token}`, // Attach the Bearer token for authorization
      },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching Loan Stats:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch Loan Graph Stats");
  }
};


export const getDataForTransactionGraph = async () => {
  const token = localStorage.getItem("adminToken"); // Get token from localStorage
  
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/transaction-graph`, {
      headers: {
        "Content-Type": "application/json", // Set Content-Type for the request
        Authorization: `Bearer ${token}`, // Attach the Bearer token for authorization
      },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching Transaction Stats:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch Transaction Graph Stats");
  }
};
export const deletePlatformDataFromDatabase = async ({ userId, platformName, accountId }) => {
  const token = getAuthToken();  // Get the token for authorization
  
  try {
    // Make the POST request to your back-end API endpoint
    const response = await axios.post(
      `${BASE_URL}/phyllo/deletePlatformData`,  // Adjust the URL to your back-end route
      {
        userId,  // Send the necessary data in the body
        platformName,  // Make sure the key matches the API expected parameter name
        accountId,
      
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization header with the token
        },
      }
    );

    if (response.data && response.data.success) {
      console.log(`${platformName} account data deleted successfully.`);
      return true;  // Return success
    } else {
      console.error(`${platformName} account data deletion failed.`);
      return false;  // Return failure
    }
  } catch (error) {
    console.error("Error disconnecting account and deleting data:", error);
    return false;  // Return failure in case of error
  }
};



export const fetchLoanStatus = async (loanId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  try {
    const response = await axios.get(`${BASE_URL}/loans/${loanId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      return response.data.loan.status;  // Return the loan status if successful
    } else {
      throw new Error(`Failed to fetch loan status: ${response?.data?.message}`);
    }
  } catch (error) {
    // Catch and log errors
    console.error('Error fetching loan status:', error.response?.data || error.message);
    throw error; // Rethrow the error for the component to handle
  }
};





export const updateStatusAdmin = async ({ loanId,userId, status,adminName ,adminEmail,userEmail,transactionId,userName,loanAmount,approvalDate,   interestRate,
  months}) => {
  const token = localStorage.getItem("adminToken");
  
  // Check if token exists before making the request
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/loans/${loanId}`,
      { status,adminName ,adminEmail,userEmail,transactionId,userName,loanAmount,approvalDate,loanId,userId,interestRate,months }, // Directly send the status in the request body
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
      }
    );

    // Check the response for success
    if (response?.data?.success) {
   
      return response.data;  // Return the response data if needed
    } else {
      console.error(`Failed to update loan status: ${response?.data?.message || "Unknown error"}`);
      throw new Error(`Failed to update loan status`);
    }
  } catch (error) {
    console.error("Error while updating loan status:", error.response?.data || error.message);
    throw error; // Ensure the error is propagated for further handling
  }
};



export const fetchLiabilities = async () => {
  const token = getAuthToken();
  const accessToken = localStorage.getItem("plaidToken");
  const userId = localStorage.getItem("user_id");
   // if (!accessToken) {
  //   throw new Error("Access token not found");
  // }

  try {
    const response = await axios.post(
      `${BASE_URL}/plaid/liabilities`,
      { accessToken },
      {
        params: { userId },
        headers: {
          'Content-Type': 'application/json', // Ensure you're sending JSON data
          Authorization: `Bearer ${token}`,  // Authorization token for your API
        }
      }
    );
  
    return response.data;
  } catch (err) {
    console.error("Error in fetchLiabilities:", err.response || err); // Debugging
    throw new Error(err.response?.data?.error || "An unexpected error occurred");
  }
};

export const fetchTransactions = async (startDate, endDate) => {
  const token = getAuthToken();
  const accessToken = localStorage.getItem("plaidToken");
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/plaid/transactions`,
      { accessToken, startDate, endDate },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Optional: Set timeout (in ms) for request to prevent hanging
      }
    );

    // Ensure response is successful and contains the expected data
    if (response && response.data) {
  
      return response.data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (err) {
    console.error("Error in fetchTransactions:", err.response || err); // Debugging
    throw new Error(err.response?.data?.error || "An unexpected error occurred");
  }
};


export const generateProcessToken = async (account_id,access_token) => {
  const token = getAuthToken();
  if (!access_token) {
    throw new Error("Access token not found");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/recipient/create-processor-token`,
      { account_id, access_token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      
      }
    );

  if (response && response?.data?.processor_token) {  // <-- fix here
      return response?.data?.processor_token;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (err) {
    console.error("Error in generateProcessToken:", err.response || err);
    throw new Error(err.response?.data?.error || "Failed to generate process token");
  }
};


export const saveProcessToken = async (processToken,userId) => {
 
  const plainToken = typeof processToken === 'string' 
    ? processToken 
    : (processToken?.processor_token || String(processToken));


  const token = getAuthToken();

  try {
    const response = await axios.post(
      `${BASE_URL}/recipient/save-process-token`,
    {
        process_token: processToken,
        user_id: userId,  
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
       
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error saving process token:", err.response || err);
    throw new Error(err.response?.data?.error || "Failed to save process token");
  }
};

export const createCustomerPayout = async (payoutData) => {
  const token = localStorage.getItem("adminToken");

  try {
    const response = await axios.post(
      `${BASE_URL}/recipient/create-customer-payout`,
      payoutData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
       
      }
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (err) {
    console.error("Error in createCustomerPayout:", err.response || err);
    throw new Error(err.response?.data?.error || "Failed to create payout");
  }
};



export const fetchAverageBalance = async (startDate, endDate) => {
  const token = getAuthToken();
  const accessToken = localStorage.getItem("plaidToken");

  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/plaid/average-balance`,
      { accessToken, startDate, endDate },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // Optional timeout
      }
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (err) {
    console.error("Error in fetchAverageBalance:", err.response || err);
    throw new Error(err.response?.data?.error || "An unexpected error occurred");
  }
};
export const fetchPlaidProcessToken = async (userId) => {
  const token = localStorage.getItem("adminToken");

console.log("userId",userId);

  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/plaid/plaid-user/${userId}/process-token`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      
      }
    );
console.log("response?.data?.plaid_process_token",response?.data);

    if (response?.data?.plaid_process_token) {
      return response.data.plaid_process_token;
    } else {
      throw new Error('plaid_process_token not found in response');
    }
  } catch (err) {
    console.error("Error in fetchPlaidProcessToken:", err.response || err);
    throw new Error(err.response?.data?.error || "An unexpected error occurred");
  }
};


export const fetchIdentityDataByAccountId = async (accountId) => {
  if (!accountId) throw new Error('accountId is required');

  const token = localStorage.getItem("adminToken");

  try {
    const response = await axios.get(`${BASE_URL}/plaid/account/${accountId}/identity-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response?.data?.identity_data) {
      return response.data.identity_data;
    } else {
      throw new Error('identity_data not found in response');
    }
  } catch (error) {
    console.error('Error fetching identity_data:', error.response || error);
    throw new Error(error.response?.data?.error || 'Failed to fetch identity data');
  }
};


// Function to update the admin profile
export const updateAdminProfile = async (data) => {
  const token = localStorage.getItem("adminToken");
  
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await axios.put(
      `${BASE_URL}/admin/profile-update`, // API endpoint
      formData, // Pass formData directly as the payload
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          // Content-Type is automatically set when using FormData
        },
      }
    );

    return response.data; // Return the successful response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.response?.data?.message || "Failed to update profile.");
  }
};


// Function to update the admin profile
export const updateUserProfile = async (data) => {
  const token = getAuthToken();
 
  if (!token) {
    console.error("User token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await axios.put(
      `${BASE_URL}/auth/profile-update`, // API endpoint
      formData, // Pass formData directly as the payload
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          // Content-Type is automatically set when using FormData
        },
      }
    );
return response.data; // Return the successful response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.response?.data?.message || "Failed to update profile.");
  }
};





export const getAdminProfile = async () => {
  const token = localStorage.getItem("adminToken"); // Get token from localStorage
  
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: {
        "Content-Type": "application/json", // Set Content-Type for the request
        Authorization: `Bearer ${token}`, // Attach the Bearer token for authorization
      },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};



export const getUserProfile = async () => {
  const token = getAuthToken();
 
  if (!token) {
    console.error("User token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        "Content-Type": "application/json", // Set Content-Type for the request
        Authorization: `Bearer ${token}`, // Attach the Bearer token for authorization
      },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

export const updatePassword = async ({ currentPassword, newPassword , confirmPassword}) => {
  // Replace "userToken" with the actual token key if needed
  const token = localStorage.getItem("adminToken");
   // Check if token exists before making the request
   if (!token) {
     console.error("Admin token is missing");
     throw new Error("Authorization token is missing");
   }
 
   try {
     const response = await axios.post(`${BASE_URL}/admin/change-password`,
       { currentPassword, newPassword, confirmPassword }, // Request body
       {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`, // Include the token in the header
         },
       }
     );
 
     // Check if the response is successful
     if (response?.data?.success) {
    
       return response.data; // Return the response data if needed
     } else {
       console.error(`Failed to update password: ${response?.data?.message || "Unknown error"}`);
       throw new Error(response?.data?.message || "Failed to update password");
     }
   } catch (error) {
     console.error("Error while updating password:", error.response?.data || error.message);
     throw error; // Ensure the error is propagated for further handling
   }
 };
 export const updateStatusForIdentityPayment = async () => {
  const token = getAuthToken();
  
  // Check if token exists before making the request
  if (!token) {
    console.error("User token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/update-identity-payment-status`,
      { hasPaidForVerification: true }, //  Pass data correctly
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check the response for success
    if (response?.data?.success) {
      return response.data;  // Return the response data if needed
    } else {
      console.error(`Failed to update user one-time payment status: ${response?.data?.message || "Unknown error"}`);
      throw new Error(`Failed to update identity payment status`);
    }
  } catch (error) {
    console.error("Error while updating payment status:", error.response?.data || error.message);
    throw error; // Ensure the error is propagated for further handling
  }
};

export const updateTermsAcceptStatus = async () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/update-terms-accept-status`,
      { termsAccepted: true }, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Server ka message aur success yahi se aayega
    return response.data; // { success: true/false, message: "..." }

  } catch (error) {
    if (error.response && error.response.data) {
      // Server ne kuch message diya hai
      throw new Error(error.response.data.message);
    } else {
      // Agar server ka koi proper response nahi aaya
      throw new Error("Something went wrong while updating terms acceptance status");
    }
  }
};


export const getTermsAcceptanceStatus = async () => {
  const token = getAuthToken();  // This function should return the user's JWT token

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/auth/get-terms-status`, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Server ka message aur success yahi se aayega
    return response.data; // { success: true/false, termsAccepted: true/false }

  } catch (error) {
    if (error.response && error.response.data) {
      // Server ne kuch message diya hai
      throw new Error(error.response.data.message);
    } else {
      // Agar server ka koi proper response nahi aaya
      throw new Error("Something went wrong while fetching terms acceptance status");
    }
  }
};
 export const updateUserPassword = async ({  currentPassword,
  newPassword,
  confirmPassword}) => {
  // Replace "userToken" with the actual token key if needed
  const token = localStorage.getItem("userToken");
   // Check if token exists before making the request
   if (!token) {
     console.error("User token is missing");
     throw new Error("Authorization token is missing");
   }
 
   try {
     const response = await axios.post(`${BASE_URL}/auth/change-password`,
    
       { currentPassword, newPassword, confirmPassword }, // Request body
       {
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`, // Include the token in the header
         },
       }
     );
 
     // Check if the response is successful
     if (response?.data?.success) {
       return response.data; // Return the response data if needed
     } else {
       console.error(`Failed to update password: ${response?.data?.message || "Unknown error"}`);
       throw new Error(response?.data?.message || "Failed to update password");
     }
   } catch (error) {
     console.error("Error while updating password:", error.response?.data || error.message);
     throw error; // Ensure the error is propagated for further handling
   }
 };

 export const fetchStateAnnualPercentageRate = async (loanAmount, repaymentTerm, state) => {
   const url = `${BASE_URL}/phyllo/fetchStateAnnualPercentageRate?state=${state}&loan_term=${repaymentTerm}&loan_amount=${loanAmount}`;
   const token = getAuthToken();
   try {
     const response = await axios.get(url, {
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`, // Include the token in the header
       },
     });
   
     const data = response.data;  // The API's response data
     
     return data; 
   } catch (error) {
     console.error("Error fetching data:", error);
     throw error;
   }
 };
 
