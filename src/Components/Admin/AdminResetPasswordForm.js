import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { resetAdminPassword } from '../../API/authApi'; // API to reset password
import { ToastContainer, toast } from 'react-toastify';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Logo from "../../assets/images/logo.jpg";

const AdminResetPasswordForm = () => {
  const { token } = useParams(); // Get token from URL params
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {

   
    try {
      setIsLoading(true);
      const response = await resetAdminPassword(token, data.password);  
    
      toast.success(response?.message || "Password has been reset successfully.");
      setTimeout(() => navigate("/admin"), 2000); // Redirect to login page
    } catch (error) {
      toast.error(error?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
    
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
      <div className="flex justify-center mb-2">
        <img src={Logo} alt="logo" className="logo" />
      </div>

        <h2 className="text-xl mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
              })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              className="absolute right-3 top-7 text-gray-500"
            >
              {showPassword ? <IoEyeOffOutline size={25} /> : <IoEyeOutline size={25} />}
            </button>
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "The passwords do not match",
              })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              className="absolute right-3 top-10 text-gray-500"
            >
              {showConfirmPassword ? <IoEyeOffOutline size={25} /> : <IoEyeOutline size={25} />}
            </button>
            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#5EB66E] text-white py-2 font-bold rounded-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default AdminResetPasswordForm;
