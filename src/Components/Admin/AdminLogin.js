import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/logo.jpg";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL; 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Initialize the navigate function

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true); // Show loader
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, {
        email: data.email,
        password: data.password
      });

      // Check if the response contains a token
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('adminToken', response.data.token);

        // Decode the token to access the user role
        const decodedToken = jwtDecode(response.data.token);
      // Display success message and navigate to admin dashboard
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/admin/dashboard'); // Navigate to admin dashboard
        }, 2000);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex justify-center min-h-screen font-sans">
  <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 h-full min-h-screen">
    <div className="flex justify-center mb-6">
      <img src={Logo} alt="logo" className="logo" />
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mt-3">
        <label htmlFor="email" className="block text-[#8F959E] font-sans text-base mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
              message: "Enter a valid email",
            },
          })}
          className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {errors.email && <span className="text-left text-red-500 text-[16px]">{errors.email.message}</span>}
      </div>

      <div className="relative mt-3">
        <label htmlFor="password" className="block text-[#8F959E] font-sans text-base mb-1">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="text-[16px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-[#C4C4C4]"
        >
          {showPassword ? <IoEyeOffOutline size={25} /> : <IoEyeOutline size={25} />}
        </button>
        {errors.password && <span className="text-left text-red-500 text-[16px]">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        className={`font-sans w-full bg-[#5EB66E] text-white py-2 font-bold rounded-md hover:bg-green-700 transition duration-300 !mt-6 text-[16px] ${
          isLoading ? "opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>

    {/* Toast Container */}
    <ToastContainer position="top-center" autoClose={2000} />
  </div>
</div>

  );
};

export default AdminLogin;
