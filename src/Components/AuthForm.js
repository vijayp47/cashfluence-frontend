import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/images/logo.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { userSignup, userLogin, verifyAccount } from '../API/authApi'; 
import useStore from './store/userProfileStore';

const AuthForm = ({ onLogin }) => {
  const { fetchProfileData } = useStore();
  const [isVerifying, setIsVerifying] = useState(false); // For OTP verification loading
  const [isLoading, setIsLoading] = useState(false); // For signup/login loading
  const [isLogin, setIsLogin] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    try {
      setIsLoading(true); // Show loader
      let result;
      if (isLogin) {
        result = await userLogin(rest); // Call the login API
        localStorage.clear();
        if (result.success && result.token) {
            localStorage.clear();
         
            localStorage.setItem('user_id', result.userId);
          localStorage.setItem('userToken', result.token); // Store the token from the login response
          toast.success(result.message || 'Login successful!');
          await fetchProfileData();
          setTimeout(() => {
            onLogin();
            navigate("/kyc-profile");
          }, 2000);
        } else {
          throw new Error(result.message || 'Login failed');
        }
      } else {
        result = await userSignup(rest); // Call the signup API
        localStorage.clear();
        setEmail(rest.email); // Store email for OTP verification
        toast.success(result.message || 'Signup successful! Please verify your email.');
      
        setIsVerifying(true); // Show OTP verification form
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  
  // OTP submission handler
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Show loader for OTP verification
      const result = await verifyAccount({
        email, // Use the stored email state
        otp: verificationCode // Assuming this is your OTP
      });
      toast.success(result.message || 'Verification successful!');
      setTimeout(() => {
        setIsVerifying(false); // Hide OTP screen
        setIsLogin(true); // Switch to login form
      }, 1000); // Slight delay for a better transition effect
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex justify-center min-h-screen font-sans">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 h-full min-h-screen">
        <div className="flex justify-center mb-2">
          <img src={Logo} alt="logo" className="w-17 h-17 mt-6" />
        </div>

        <div className="flex mb-6 relative mt-8">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`font-sans relative font-normal text-[16px] flex-1 py-2 ${!isLogin ? 'bg-[#5EB66E] text-white' : 'bg-[#E5E5E5] text-black'}`}
            style={{ marginRight: '-10px' }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`relative text-[16px] flex-1 py-2 ${isLogin ? 'bg-[#5EB66E] text-white' : 'bg-[#E5E5E5] text-black'}`}
          >
            Login
          </button>
        </div>

        {/* Form */}
        {!isVerifying ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 text-left">
          {!isLogin && (
            <>
              <div className='mt-3'>
                <label htmlFor="firstName" className="block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-1">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName", { required: "First name is required" })}
                  className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                {errors.firstName && <span className="text-red-500 text-[16px] text-left">{errors.firstName.message}</span>}
              </div>

              <div className='mt-3'>
                <label htmlFor="lastName" className="block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-1">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName", { required: "Last name is required" })}
                  className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                {errors.lastName && <span className="text-left text-red-500 text-[16px]">{errors.lastName.message}</span>}
              </div>
            </>
          )}

          <div className='mt-3'>
            <label htmlFor="email" className="block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email",
                },
              })}
              className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.email && <span className="text-left text-red-500 text-[16px]">{errors.email.message}</span>}
          </div>

          <div className="relative mt-3">
            <label htmlFor="password" className="block text-[#8F959E] text-[16px] font-sans text-base leading-[21.82px] text-left mb-1">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
       {isLogin ?   <div className="text-right">
            <button
              type="button"
              className="text-[#5EB66E]  hover:underline mt-4"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div> : null}   
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-[#C4C4C4]"
            >
              {showPassword ? <IoEyeOffOutline size={25} /> : <IoEyeOutline size={25}/>}
            </button>
            {errors.password && <span className="text-left text-red-500 text-[16px]">{errors.password.message}</span>}
          </div>

          {!isLogin && (
            <div className="relative mt-3">
              <label htmlFor="confirmPassword" className="text-[16px] block text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => value === password || "The passwords do not match"
                })}
                className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-[#C4C4C4]"
              >
                {showConfirmPassword ? <IoEyeOffOutline size={25} /> : <IoEyeOutline size={25}/>}
              </button>
              {errors.confirmPassword && <span className="text-left text-red-500 text-[16px]">{errors.confirmPassword.message}</span>}
            </div>
          )}

          <button
            type="submit"
            className="font-sans w-full bg-[#5EB66E] text-white py-2 font-bold rounded-md hover:bg-[5EB66E] transition duration-300 !mt-6 text-[16px]"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Processing...' : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>) :  (
          // OTP Verification Form
          <form onSubmit={handleOtpSubmit} className="space-y-4 mt-6 text-left">
            <div className="mt-3">
              <label htmlFor="otp" className="block text-[16px] text-[#8F959E] font-sans text-base leading-[21.82px] text-left mb-1">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <button
              type="submit"
              className="font-sans w-full bg-[#5EB66E] text-white py-2 font-bold rounded-md hover:bg-green-700 transition duration-300 !mt-6 text-[16px]"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Toast Container */}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default AuthForm;
