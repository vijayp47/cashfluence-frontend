import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({ onSuccess, onClose, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        setLoading(false);

        if (error) {
            toast.error("Payment failed. Please try again.");
        } else if (paymentIntent?.status === "succeeded") {
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-5 text-center">Complete Payment</h2>
                    {/* Display the amount */}
                    <p className="text-lg text-center mb-4 font-semibold">Amount: $80 USD</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Element for multiple payment methods */}
                    <div className="p-5 border border-gray-300 rounded-lg shadow-sm bg-gray-100">
                        <PaymentElement className="p-3 text-gray-700 text-lg" />
                    </div>

                    {/* Payment Button */}
                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="w-full py-3 bg-[#5EB66E] text-white font-semibold rounded-xl transition-all duration-300 disabled:bg-gray-400 shadow-lg text-lg"
                    >
                        {loading ? "Processing..." : "Pay Securely"}
                    </button>
                </form>

                {/* Cancel Button */}
                <button onClick={onClose} className="mt-5 text-red-600 font-semibold text-lg block w-full text-center">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CheckoutForm;
