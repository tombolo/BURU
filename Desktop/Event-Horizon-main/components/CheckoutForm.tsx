"use client";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm({ totalAmount }: { totalAmount: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`, // where Stripe will redirect after payment
            },
        });

        if (error) {
            setErrorMessage(error.message ?? "Payment failed");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <PaymentElement />
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    `Pay $${totalAmount.toFixed(2)}`
                )}
            </button>
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}
        </form>
    );
}
