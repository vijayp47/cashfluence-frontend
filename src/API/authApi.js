import { postApi,adminpostApi } from './apiServices';

// Function to handle user signup
export const userSignup = (data) => {
  return postApi('/auth/register', data); // Make a POST request to the signup endpoint
};

// Function to handle user login
export const userLogin = (data) => {
  return postApi('/auth/login', data); // Make a POST request to the login endpoint
};

// Function to send a verification email (optional if needed)
export const sendVerificationEmail = (email) => {
  return postApi('/auth/send-verification', { email }); // Make a POST request to send the verification email
};

// Function to verify the OTP for account verification
export const verifyAccount = (data) => {
  return postApi('/auth/verify-otp', data); // Make a POST request to verify the OTP
};
export const resendOTP = (data) => {
  return postApi('/auth/resend-otp', data); // Make a POST request to verify the OTP
};

// Function to request a password reset link
export const sendResetPasswordEmail = (email) => {
  return postApi('/auth/forgot-password', { email }); // Make a POST request to initiate password reset
};

export const sendAdminResetPasswordEmail = (email) => {
  return adminpostApi('/admin/forgot-password', { email }); // Make a POST request to initiate password reset
};

// Function to reset the password using the token
export const resetPassword = (token, password) => {
 return postApi(`/auth/reset-password/${token}`, { password }); // Make a POST request to reset password using the token
};



export const resetAdminPassword = (token, password) => {
  if (!token) {
    console.error("Reset Token is missing."); // Debug missing token
    throw new Error("Reset token is required.");
  }


  return adminpostApi(`/admin/reset-password/${token}`, { password });
};
