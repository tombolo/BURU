import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FiTrash2, FiChevronLeft, FiLogIn, FiShoppingCart, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('eventCart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('eventCart', JSON.stringify(cart));
        }
    }, [cart, isClient]);

    const handleRemove = (cartKey) => {
        setCart(prev => prev.filter((item) => item.cartKey !== cartKey));
    };

    const handleQuantityChange = (cartKey, quantity) => {
        const newQuantity = Math.max(1, Math.min(10, Number(quantity))) || 1;
        setCart(prev =>
            prev.map((item) =>
                item.cartKey === cartKey ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleContinueShopping = () => {
        router.push('/');
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const handleSignIn = () => {
        router.push('/auth/signin?callbackUrl=/cart');
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const serviceFee = 0;
    const tax = 0;
    const finalTotal = totalAmount + serviceFee + tax;

    if (!isClient) {
        return null;
    }

    return (
        <>
            <Header cart={cart} />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <button
                            onClick={handleContinueShopping}
                            className="flex items-center text-[#026CDF] hover:text-[#0259B3] mb-4 transition-colors font-medium"
                        >
                            <FiChevronLeft className="mr-1 h-5 w-5" />
                            Continue Shopping
                        </button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    Your Cart
                                </h1>
                                {totalItems > 0 && (
                                    <p className="text-gray-600">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                                    </p>
                                )}
                            </div>
                            {totalItems > 0 && (
                                <div className="hidden md:flex items-center justify-center w-16 h-16 bg-[#026CDF]/10 rounded-full">
                                    <FiShoppingCart className="h-8 w-8 text-[#026CDF]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {cart.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiShoppingCart className="h-12 w-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Looks like you haven't added any tickets to your cart yet. Start exploring our amazing events!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleContinueShopping}
                                className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Browse Events
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item, index) => (
                                    <motion.div
                                        key={item.cartKey}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                                    >
                                        <div className="p-4 md:p-6">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {/* Image */}
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full sm:w-32 h-32 md:h-36 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>

                                                {/* Item Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                                                {item.title}
                                                            </h2>
                                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-[#026CDF]/10 text-[#026CDF] capitalize">
                                                                    {item.type === 'general' ? 'General Admission' : item.type.replace('-', ' ')}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(item.date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="text-base md:text-lg font-bold text-[#026CDF]">
                                                                ${item.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">each</span>
                                                            </p>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => handleRemove(item.cartKey)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            aria-label="Remove item"
                                                        >
                                                            <FiTrash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.cartKey, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FiMinus className="h-4 w-4 text-gray-700" />
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="10"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item.cartKey, e.target.value)}
                                                                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#026CDF] focus:border-transparent"
                                                            />
                                                            <button
                                                                onClick={() => handleQuantityChange(item.cartKey, item.quantity + 1)}
                                                                disabled={item.quantity >= 10}
                                                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <FiPlus className="h-4 w-4 text-gray-700" />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg md:text-xl font-bold text-gray-900">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm md:text-base">
                                            <span className="text-gray-600">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                                            <span className="font-medium text-gray-900">${totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm md:text-base">
                                            <span className="text-gray-600">Service Fee</span>
                                            <span className="font-medium text-gray-900">${serviceFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm md:text-base">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t-2 border-gray-300 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-[#026CDF]">
                                                ${finalTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {status === 'loading' ? (
                                        <button
                                            disabled
                                            className="w-full bg-gray-300 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg cursor-not-allowed"
                                        >
                                            Loading...
                                        </button>
                                    ) : session ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCheckout}
                                            className="w-full bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                                        >
                                            <FiCheck className="mr-2 h-5 w-5" />
                                            Proceed to Checkout
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSignIn}
                                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                                        >
                                            <FiLogIn className="mr-2 h-5 w-5" />
                                            Sign In to Checkout
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default CartPage;
