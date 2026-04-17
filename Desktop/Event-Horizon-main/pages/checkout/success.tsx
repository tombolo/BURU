"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiCheck, FiHome, FiShoppingBag } from "react-icons/fi";
import { motion } from "framer-motion";

const CheckoutSuccessPage = () => {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cartData = JSON.parse(localStorage.getItem("eventCart") || "[]");
            setCart(cartData);

            const total = cartData.reduce(
                (acc: number, item: any) => acc + item.price * item.quantity,
                0
            );
            setTotalAmount(total);

            // Clear cart after successful payment
            setTimeout(() => {
                localStorage.removeItem("eventCart");
            }, 5000);
        }
    }, []);

    const handleContinueShopping = () => {
        router.push("/");
    };

    const handleViewOrders = () => {
        router.push("/");
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                            <FiCheck className="h-10 w-10 text-white" />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                            Thank you for your purchase. Your tickets have been confirmed and a confirmation email has been sent to your registered email address.
                        </p>

                        {/* Order Summary */}
                        {cart.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
                                    Order Summary
                                </h3>
                                <div className="space-y-3 mb-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.cartKey}
                                            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-900">
                                                    {item.title}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2 capitalize">
                                                    ({item.type})
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    × {item.quantity}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#026CDF]">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleContinueShopping}
                                className="flex-1 sm:flex-none px-8 bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                            >
                                <FiHome className="mr-2 h-5 w-5" />
                                Continue Shopping
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleViewOrders}
                                className="flex-1 sm:flex-none px-8 bg-white border-2 border-gray-300 hover:border-[#026CDF] hover:bg-[#026CDF]/5 text-gray-800 hover:text-[#026CDF] font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center"
                            >
                                <FiShoppingBag className="mr-2 h-5 w-5" />
                                View Events
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CheckoutSuccessPage;
