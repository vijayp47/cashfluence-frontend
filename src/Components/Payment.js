import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// const stripePromise = loadStripe(process.env.REACT_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe("pk_test_51PnDYCHJvnanatbhqplAFXJaRmLHiZf225u3hQ4FL3AcN5ear6ZZsggNWieJcHnf5pacaIYT3gB2k2ti0LsWOyRo00dEmBlxTO");

const Payment = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
};

export default Payment;
