"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FiChevronLeft, FiShield, FiLock, FiCreditCard } from "react-icons/fi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLIC_KEY environment variable");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// Convert to cents for Stripe
function convertToSubcurrency(amount: number): number {
    return Math.round(amount * 100);
}

const CheckoutPage = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cartData = JSON.parse(localStorage.getItem("eventCart") || "[]");
            
            if (cartData.length === 0) {
                router.push("/cart");
                return;
            }

            setCart(cartData);

            const total = cartData.reduce(
                (acc: number, item: any) => acc + item.price * item.quantity,
                0
            );
            setTotalAmount(total);

            // Create PaymentIntent on backend
            if (total > 0) {
                fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: convertToSubcurrency(total) }),
                })
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error("Failed to create payment intent");
                        }
                        return res.json();
                    })
                    .then((data) => {
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setClientSecret(data.clientSecret);
                        }
                    })
                    .catch((err) => {
                        console.error("Error creating PaymentIntent:", err);
                        setError("Failed to initialize payment. Please try again.");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    }, [router]);

    const handleContinueShopping = () => {
        router.push("/");
    };

    const serviceFee = 0;
    const tax = 0;
    const finalTotal = totalAmount + serviceFee + tax;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-[#026CDF] hover:text-[#0259B3] mb-6 transition-colors font-medium"
                    >
                        <FiChevronLeft className="mr-1 h-5 w-5" />
                        Back to Cart
                    </button>

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Checkout
                        </h1>
                        <p className="text-gray-600">
                            Complete your purchase securely with Stripe
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                    {cart.map((item, index) => (
                                        <motion.div
                                            key={item.cartKey}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 capitalize mb-1">
                                                    {item.type.replace('-', ' ')}
                                                </p>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {new Date(item.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </span>
                                                    <span className="font-semibold text-gray-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-200 space-y-3 mb-6">
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ${totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span className="font-medium text-gray-900">
                                            ${serviceFee.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-gray-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-[#026CDF]">
                                            ${finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                    <div className="w-10 h-10 bg-[#026CDF]/10 rounded-lg flex items-center justify-center">
                                        <FiCreditCard className="h-5 w-5 text-[#026CDF]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                            Payment Details
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Secure payment powered by Stripe
                                        </p>
                                    </div>
                                </div>

                                {/* Security Badges */}
                                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiShield className="h-5 w-5 text-green-600" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FiLock className="h-5 w-5 text-green-600" />
                                        <span>SSL Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-semibold">🔒</span>
                                        <span>256-bit Encryption</span>
                                    </div>
                                </div>

                                {/* Payment Form */}
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <svg
                                                className="animate-spin h-8 w-8 text-[#026CDF] mx-auto mb-4"
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
                                            <p className="text-gray-600">Loading payment form...</p>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                        <p className="text-red-700 font-medium mb-2">{error}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-[#026CDF] hover:text-[#0259B3] font-medium text-sm"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : clientSecret ? (
                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret,
                                            appearance: {
                                                theme: 'stripe' as const,
                                                variables: {
                                                    colorPrimary: '#026CDF',
                                                    colorBackground: '#ffffff',
                                                    colorText: '#1f2937',
                                                    colorDanger: '#ef4444',
                                                    fontFamily: 'system-ui, sans-serif',
                                                    spacingUnit: '4px',
                                                    borderRadius: '12px',
                                                },
                                            },
                                        }}
                                    >
                                        <CheckoutForm totalAmount={finalTotal} />
                                    </Elements>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                        <p className="text-yellow-800">Unable to initialize payment. Please try again.</p>
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        Your payment information is encrypted and secure. We never store your card details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CheckoutPage;
