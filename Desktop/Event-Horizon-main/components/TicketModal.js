import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiClock, FiMapPin, FiStar } from "react-icons/fi";

const TicketModal = ({ event, onClose }) => {
    if (!event) return null;
  return (
    
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <FiX className="h-5 w-5 text-gray-700" />
            </button>
            {event.seatsLeft < 50 && (
              <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Only {event.seatsLeft} left!
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {event.title}
                </h2>
                <p className="text-gray-600">{event.artist}</p>
              </div>
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <FiStar className="mr-1" /> {event.rating}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <FiCalendar className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <br />
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">
                      {event.venue}
                      <br />
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Ticket Options
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">General Admission</h4>
                      <p className="text-sm text-gray-500">
                        Standing room only
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${event.price}</p>
                      {event.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${event.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">VIP Package</h4>
                      <p className="text-sm text-gray-500">
                        Early entry + perks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${event.price + 100}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition duration-300">
                Buy Now
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    
  );
};

export default TicketModal;
