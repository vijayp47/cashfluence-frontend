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
      external_id: external_id // Send external_id as part of the request body
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
      { accessTokens: accessTokensArray }, // Body of the request
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


export const deletePlatformDataFromDatabase = async ({ userId, platformName }) => {
  const token = getAuthToken();
  try {
    const response = await axios.delete(`${BASE_URL}/phyllo/deletePlatformData`, {
      data: {
        userId: userId,
        platformName: platformName,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add token to the request headers
      },
    });

    if (response?.data?.success) {
      console.log(`${platformName} data deleted successfully from the database.`);
    } else {
      console.error(`Failed to delete ${platformName} data from the database.`);
    }
  } catch (error) {
    console.error("Error while deleting platform data:", error);
    throw error; // Ensure the error is propagated
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

export const updateStatusAdmin = async ({ loanId, status,adminName ,userEmail,transactionId,userName,loanAmount,approvalDate}) => {
  const token = localStorage.getItem("adminToken");
  
  // Check if token exists before making the request
  if (!token) {
    console.error("Admin token is missing");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.patch(
      `${BASE_URL}/loans/${loanId}`,
      { status,adminName ,userEmail,transactionId,userName,loanAmount,approvalDate,loanId }, // Directly send the status in the request body
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





export const fetchPaymentStatus = async (loanId) => {
 const token = getAuthToken();
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  try {
    const response = await axios.get(`${BASE_URL}/loans/${loanId}/pending-status`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.success) {
      return {
        userId: response.data.userId,
        paymentPending: response.data.paymentPending,
      };
    } else {
      throw new Error(`Failed to fetch loan status: ${response?.data?.message}`);
    }
  } catch (error) {
    console.error('Error fetching loan status:', error.response?.data || error.message);
    throw error; // Rethrow the error for the component to handle
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
 
