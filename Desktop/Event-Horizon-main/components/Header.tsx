import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ cart = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Fetch user balance when session changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.email) {
        setBalanceLoading(true);
        try {
          const response = await fetch('/api/user/balance');
          const data = await response.json();
          if (response.ok) {
            setUserBalance(data.balance);
          } else {
            console.error('Failed to fetch balance:', data.error);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        } finally {
          setBalanceLoading(false);
        }
      } else {
        setUserBalance(null);
      }
    };

    fetchBalance();
  }, [session]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = async () => {
    setIsLoading(true);
    try {
      if (session) {
        await signOut({ callbackUrl: '/' });
      } else {
        await signIn('credentials', { callbackUrl: '/' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: number | null) => {
    if (balance === null) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  return (
    <header className="fixed w-full bg-white z-50 border-b border-gray-100 shadow-md">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand Name - Beautiful Design */}
          <motion.div
            onClick={() => router.push('/')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              {/* Beautiful SVG Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative flex-shrink-0"
              >
                <svg
                  width="36"
                  height="36"
                  className="md:w-11 md:h-11 drop-shadow-lg"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#026CDF" />
                      <stop offset="50%" stopColor="#1E40AF" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                      <feOffset dx="0" dy="2" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Background Circle with Gradient */}
                  <circle cx="30" cy="30" r="30" fill="url(#logoGradient)" filter="url(#shadow)" />
                  
                  {/* Ticket Stub - Main Design */}
                  <rect x="14" y="18" width="32" height="24" rx="3" fill="white" opacity="0.98" />
                  
                  {/* Perforated Edge */}
                  <circle cx="14" cy="30" r="2.5" fill="#026CDF" />
                  <path d="M 14 18 Q 14 24 14 30 Q 14 36 14 42" stroke="#026CDF" strokeWidth="2" strokeLinecap="round" fill="none" />
                  
                  {/* Ticket Details - Horizontal Lines */}
                  <path d="M 20 25 L 40 25" stroke="#026CDF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                  <path d="M 22 32 L 38 32" stroke="#026CDF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  
                  {/* Sparkle/Star Accent */}
                  <g transform="translate(42, 22)">
                    <circle cx="0" cy="0" r="3" fill="#FBBF24" opacity="0.9" />
                    <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                    <circle cx="0" cy="0" r="1.5" fill="#FCD34D" />
                  </g>
                  
                  {/* Horizon Arc - Subtle */}
                  <path d="M 16 36 Q 30 32 44 36" stroke="#026CDF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
              </motion.div>
              
              {/* Brand Name - Elegant Typography */}
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  Event<span className="text-[#026CDF]">Horizon</span>
                </span>
                <span className="text-[8px] md:text-[9px] font-medium text-gray-500 tracking-widest uppercase mt-0.5 hidden sm:block">
                  Your Ticket to Live Events
                </span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation - Polished and Professional */}
          <nav className="hidden lg:flex items-center space-x-1 bg-gray-50 px-2 py-1.5 rounded-xl border border-gray-100">
            <motion.button
              whileHover={{ backgroundColor: 'white', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/concerts')}
              className="px-6 py-2.5 text-sm font-bold text-gray-800 hover:text-[#026CDF] hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              Concerts
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: 'white', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/sports')}
              className="px-6 py-2.5 text-sm font-bold text-gray-800 hover:text-[#026CDF] hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              Sports
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: 'white', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/festivals')}
              className="px-6 py-2.5 text-sm font-bold text-gray-800 hover:text-[#026CDF] hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              Festivals
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: 'white', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/theater')}
              className="px-6 py-2.5 text-sm font-bold text-gray-800 hover:text-[#026CDF] hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow"
            >
              Theater
            </motion.button>
          </nav>

          {/* Desktop Actions - Professional Right Side */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Cart Button */}
            <motion.button
              onClick={() => router.push('/cart')}
              whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <FiShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center shadow-lg ring-2 ring-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {status === 'loading' ? (
              <div className="animate-pulse h-11 w-28 rounded-xl bg-gray-200"></div>
            ) : session ? (
              <div className="flex items-center space-x-2">
                {/* Balance Display - Premium Design */}
                <motion.div
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group cursor-pointer"
                >
                  <div className="flex items-center bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                        <FiDollarSign className="text-white h-4 w-4 font-bold" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white/80 leading-none">Balance</span>
                        <span className="text-sm font-bold text-white leading-tight">
                          {balanceLoading ? (
                            <span className="inline-block h-4 w-16 bg-white/30 rounded animate-pulse"></span>
                          ) : (
                            formatBalance(userBalance)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200 -z-10 blur-sm"></div>
                </motion.div>

                {/* User Profile - Elegant Design */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2.5 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  {session.user?.image ? (
                    <div className="relative">
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-gray-100 shadow-sm"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#026CDF] to-[#1E40AF] flex items-center justify-center shadow-sm ring-2 ring-gray-100">
                        <FiUser className="h-4.5 w-4.5 text-white" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[120px]">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">
                      Account
                    </span>
                  </div>
                </motion.div>

                {/* Sign Out Button - Clean Design */}
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#fee2e2' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAuthClick}
                  disabled={isLoading}
                  className="relative p-2.5 text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center justify-center border border-gray-200 hover:border-red-200 shadow-sm hover:shadow-md group"
                  title="Sign Out"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4.5 w-4.5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiLogOut className="h-4.5 w-4.5 group-hover:text-red-600 transition-colors" />
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ backgroundColor: '#DC2626', scale: 1.02, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAuthClick}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center font-bold text-sm shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiUser className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  router.push('/concerts');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Concerts
              </button>
              <button
                onClick={() => {
                  router.push('/sports');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Sports
              </button>
              <button
                onClick={() => {
                  router.push('/festivals');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Festivals
              </button>
              <button
                onClick={() => {
                  router.push('/theater');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Theater
              </button>

              <div className="pt-4 mt-4 border-t border-gray-200">
                {status === 'authenticated' ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-md">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="User profile"
                          width={44}
                          height={44}
                          className="rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <FiUser className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{session.user?.name}</p>
                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>

                    {/* Mobile Balance Display */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <FiDollarSign className="text-[#10B981] mr-2 h-5 w-5" />
                        <span className="text-sm font-semibold text-gray-900">Balance</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {balanceLoading ? (
                          <span className="inline-block h-4 w-20 bg-gray-200 rounded animate-pulse"></span>
                        ) : (
                          formatBalance(userBalance)
                        )}
                      </span>
                    </div>

                    <button
                      onClick={handleAuthClick}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing out...
                        </>
                      ) : (
                        <>
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold rounded-md transition-colors shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FiUser className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;