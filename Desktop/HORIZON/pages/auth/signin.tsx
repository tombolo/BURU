import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import Header from '../../components/Header';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            const session = await getSession();

            if (session) {
                router.push('/');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header cart={[]} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Welcome Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:block"
                        >
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                        Welcome Back to
                                        <span className="block text-[#026CDF] font-semibold">EventHorizon</span>
                                    </h1>
                                    <p className="text-base text-gray-600 leading-relaxed">
                                        Sign in to access thousands of live events, concerts, sports, and more. 
                                        Your next unforgettable experience awaits.
                                    </p>
                                </div>
                                
                                {/* Feature List */}
                                <div className="space-y-4 pt-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#026CDF]/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#026CDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Exclusive Access</h3>
                                            <p className="text-sm text-gray-600">Early access to premium tickets and events</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#026CDF]/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#026CDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Secure & Safe</h3>
                                            <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#026CDF]/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#026CDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Instant Booking</h3>
                                            <p className="text-sm text-gray-600">Book your favorite events in seconds</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Login Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full max-w-md mx-auto lg:mx-0"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
                                {/* Logo and Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                        Sign In
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Access your account to continue
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-3"
                                    >
                                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-700 font-medium">{error}</p>
                                    </motion.div>
                                )}

                                {/* Login Form */}
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {/* Email Input */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiMail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-[#026CDF] transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white focus:bg-white focus:outline-none"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FiLock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                required
                                                className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:border-[#026CDF] transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white focus:bg-white focus:outline-none"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <FiEyeOff className="h-5 w-5" />
                                                ) : (
                                                    <FiEye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 text-[#026CDF] focus:ring-[#026CDF] border-gray-300 rounded cursor-pointer"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer">
                                                Remember me
                                            </label>
                                        </div>
                                        <div className="text-sm">
                                            <a href="#" className="font-semibold text-[#026CDF] hover:text-[#0259B3] transition-colors">
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <FiArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {/* Sign Up Link */}
                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <p className="text-center text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link href="/auth/signup" className="font-bold text-[#026CDF] hover:text-[#0259B3] transition-colors">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500 mb-4">Secure checkout with</p>
                                <div className="flex items-center justify-center space-x-6 opacity-60">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                        </svg>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
