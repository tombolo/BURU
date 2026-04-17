import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiStar,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiCheck,
} from "react-icons/fi";

const TicketDetailModal = ({ event, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const router = useRouter();

  if (!event) return null;

  // Generate ticket types - support dynamic options (up to 7)
  const getTicketTypes = () => {
    // If event has ticketTypes array, use it
    if (event.ticketTypes && Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0) {
      return event.ticketTypes;
    }
    
    // Fallback: Generate default ticket types based on event
    // Default options: General, VIP, Premium, Front Row, Backstage, Early Bird, Standard
    const defaultTypes = [
      {
        id: "general",
        name: "General Admission",
        description: "Standard entry with standing room",
        price: event.price || 0,
        originalPrice: event.originalPrice,
        available: true
      },
      {
        id: "vip",
        name: "VIP Package",
        description: "Early entry + exclusive perks",
        price: (event.price || 0) + 100,
        available: true
      }
    ];

    // For events with higher price, add more options
    if (event.price > 150) {
      defaultTypes.push(
        {
          id: "premium",
          name: "Premium Seating",
          description: "Best views with reserved seating",
          price: (event.price || 0) + 150,
          available: true
        },
        {
          id: "front-row",
          name: "Front Row",
          description: "Closest to the stage",
          price: (event.price || 0) + 200,
          available: event.seatsLeft > 20
        }
      );
    }

    // For very expensive events, add more premium options
    if (event.price > 300) {
      defaultTypes.push(
        {
          id: "backstage",
          name: "Backstage Pass",
          description: "Meet & greet included",
          price: (event.price || 0) + 300,
          available: true
        },
        {
          id: "early-bird",
          name: "Early Bird",
          description: "Limited time discount",
          price: (event.price || 0) * 0.8,
          originalPrice: event.price,
          available: true
        }
      );
    }

    return defaultTypes;
  };

  const ticketTypes = getTicketTypes();

  // Set default selected ticket type on mount
  useEffect(() => {
    if (!selectedTicketType && ticketTypes.length > 0) {
      setSelectedTicketType(ticketTypes[0].id);
    }
  }, [ticketTypes, selectedTicketType]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    setQuantity(newQuantity);
  };

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType) || ticketTypes[0];
  const ticketPrice = selectedTicket?.price || event.price || 0;
  const totalPrice = ticketPrice * quantity;

  const createTicket = () => {
    return {
      id: event._id || event.id,
      title: event.title,
      artist: event.artist,
      date: event.date,
      image: event.image,
      type: selectedTicketType,
      quantity: quantity,
      price: ticketPrice,
      cartKey: `${event._id || event.id}-${selectedTicketType}`,
    };
  };

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const ticket = createTicket();

    setTimeout(() => {
      if (onAddToCart) {
        onAddToCart(ticket);
      }
      setIsAddingToCart(false);
      onClose();
    }, 800);
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    const ticket = createTicket();

    setTimeout(() => {
      if (onAddToCart) {
        onAddToCart(ticket);
      }
      setIsBuyingNow(false);
      onClose();
      router.push("/cart");
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl max-w-[98vw] sm:max-w-[95vw] md:max-w-4xl w-full max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100"
        >
          {/* Header Image */}
          <div className="relative h-32 sm:h-40 md:h-64 lg:h-72">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-sm p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>

            {/* Rating Badge */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm text-[#026CDF] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-lg flex items-center border border-gray-100">
              <FiStar className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" /> {event.rating}
            </div>

            {/* Low Stock Warning */}
            {event.seatsLeft < 50 && (
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-lg">
                Only {event.seatsLeft} left!
              </div>
            )}

            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-6">
              <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2">
                {event.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-lg text-white/90 font-medium">{event.artist}</p>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(98vh-8rem)] sm:max-h-[calc(95vh-10rem)] md:max-h-[calc(90vh-18rem)]">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#026CDF]/10 rounded-lg md:rounded-xl flex items-center justify-center mt-0.5">
                      <FiCalendar className="text-[#026CDF] h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                        Date & Time
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm font-medium leading-tight">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm font-medium">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#026CDF]/10 rounded-lg md:rounded-xl flex items-center justify-center mt-0.5">
                      <FiMapPin className="text-[#026CDF] h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                        Location
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm font-medium leading-tight">
                        {event.venue}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-xs md:text-sm font-medium leading-tight">{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Options */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4">
                    Select Ticket Type
                  </h3>
                  <div className="space-y-2 md:space-y-3 max-h-40 sm:max-h-48 md:max-h-64 overflow-y-auto pr-1 sm:pr-2">
                    {ticketTypes.map((ticketType) => (
                      <motion.div
                        key={ticketType.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => ticketType.available && setSelectedTicketType(ticketType.id)}
                        className={`relative p-2.5 sm:p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedTicketType === ticketType.id
                            ? "border-[#026CDF] bg-[#026CDF]/5 shadow-md"
                            : ticketType.available
                            ? "border-gray-200 hover:border-gray-300 bg-white"
                            : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {selectedTicketType === ticketType.id && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-[#026CDF] rounded-full flex items-center justify-center">
                            <FiCheck className="text-white h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                          </div>
                        )}
                        <div className="flex justify-between items-start pr-4 sm:pr-5 md:pr-6">
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 md:mb-1">
                              {ticketType.name}
                            </h4>
                            <p className="text-xs text-gray-500 leading-tight sm:leading-relaxed">
                              {ticketType.description}
                            </p>
                          </div>
                          <div className="text-right ml-2 sm:ml-3 md:ml-4 flex-shrink-0">
                            <p className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                              ${ticketType.price.toFixed(2)}
                            </p>
                            {ticketType.originalPrice && ticketType.originalPrice > ticketType.price && (
                              <p className="text-xs text-gray-400 line-through">
                                ${ticketType.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        {!ticketType.available && (
                          <div className="mt-2 text-xs text-red-500 font-medium">
                            Sold Out
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity and Total */}
              <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">Quantity</h4>
                  <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 bg-white rounded-lg md:rounded-xl border border-gray-200 p-0.5 sm:p-1">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMinus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-gray-600" />
                    </button>
                    <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 w-5 sm:w-6 md:w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                      className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2 md:space-y-3 pt-2 sm:pt-3 md:pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs sm:text-xs md:text-sm">
                    <span className="text-gray-600">Price per ticket:</span>
                    <span className="font-semibold text-gray-900">
                      ${ticketPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-xs md:text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 sm:pt-2 md:pt-3 border-t-2 border-gray-300">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#026CDF]">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={isBuyingNow || isAddingToCart}
                  className="flex-1 bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-2 sm:py-2.5 md:py-3.5 px-3 sm:px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                >
                  {isBuyingNow ? (
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
                    <>
                      <FiShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isBuyingNow}
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-[#026CDF] hover:bg-[#026CDF]/5 text-gray-800 hover:text-[#026CDF] font-semibold py-2 sm:py-2.5 md:py-3.5 px-3 sm:px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                >
                  {isAddingToCart ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
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
                      Adding...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketDetailModal;
