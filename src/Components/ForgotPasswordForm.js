import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { sendResetPasswordEmail } from '../API/authApi'; // API to send password reset email
import Logo from "../assets/images/logo.png";
const ForgotPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await sendResetPasswordEmail(data.email); // Call the API to send reset email
      toast.success(res?.message || "Password reset link has been sent to your email.");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
       
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
      <div className="flex justify-center mb-2">
          <img src={Logo} alt="logo" className="w-17 h-17 mt-6" />
        </div>
        <h2 className="text-xl mb-4 text-center">Forgot Password?</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#5EB66E] text-white py-2 font-bold rounded-md mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
