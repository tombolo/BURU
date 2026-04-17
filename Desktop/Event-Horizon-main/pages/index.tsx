import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { categories } from '../data/eventsData';
import TicketDetailModal from '../components/TicketDetailModal';
import Counter from '../components/Counter';

interface Event {
  _id: string;
  title: string;
  artist: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  seatsLeft: number;
  rating: number;
}

interface CartItem {
  id: string;
  type: string;
  quantity: number;
  cartKey: string;
  title: string;
  price: number;
}

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [eventsToShow, setEventsToShow] = useState(12); // Show 4 rows (4 rows × 3 columns = 12 events)
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2
  });
  const orbYOne = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const orbYTwo = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);

  const sectionReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const cardStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setEvents(data.events || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVideoLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('eventCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to parse cart:', err);
        localStorage.removeItem('eventCart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eventCart', JSON.stringify(cart));
  }, [cart]);

  const handleTicketClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const searchEvents = (query: string) => {
    if (!query) return events;

    const lowerCaseQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.artist.toLowerCase().includes(lowerCaseQuery) ||
      event.venue.toLowerCase().includes(lowerCaseQuery) ||
      event.location.toLowerCase().includes(lowerCaseQuery) ||
      event.category.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filteredEvents = activeCategory === 'all'
    ? searchEvents(debouncedSearchQuery)
    : searchEvents(debouncedSearchQuery).filter(event => event.category === activeCategory);

  // Reset events to show when category or search changes
  useEffect(() => {
    setEventsToShow(12);
  }, [activeCategory, debouncedSearchQuery]);

  const displayedEvents = filteredEvents.slice(0, eventsToShow);
  const hasMoreEvents = filteredEvents.length > eventsToShow;

  const handleLoadMore = () => {
    setEventsToShow(prev => prev + 12); // Load 4 more rows (12 events)
  };

  const handleAddToCart = (ticket: CartItem) => {
    const cartKey = `${ticket.id}-${ticket.type}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.cartKey === cartKey);
      if (existing) {
        return prevCart.map(item =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + ticket.quantity }
            : item
        );
      }
      return [...prevCart, { ...ticket, cartKey }];
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <motion.div
        style={{ scaleX: smoothScrollProgress }}
        className="fixed left-0 right-0 top-0 z-[90] h-1 origin-left bg-gradient-to-r from-[#026CDF] via-cyan-400 to-purple-500"
      />
      <Header cart={cart} />

      {showModal && selectedEvent && (
        <TicketDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      <section className="relative h-screen overflow-hidden">
        <motion.div
          style={{ y: orbYOne }}
          className="pointer-events-none absolute -left-24 top-24 z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"
        />
        <motion.div
          style={{ y: orbYTwo }}
          className="pointer-events-none absolute -right-20 bottom-10 z-10 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"
        />
        {!videoLoaded ? (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="animate-pulse text-white text-2xl">Loading experiences...</div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/events/video.mp4" type="video/mp4" />
            </video>
          </>
        )}

        <div className="relative z-20 h-full flex flex-col justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Ticket</span> to Unforgettable Experiences
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
              Discover and book tickets to the hottest events worldwide
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search events, artists, or venues..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setSearchQuery(searchQuery)}
                  className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Find Tickets
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="animate-bounce w-8 h-8 border-4 border-white rounded-full"></div>
        </motion.div>
      </section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900">Browse by Category</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">Find the perfect event for your interests</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold transition duration-200 flex items-center text-sm md:text-base ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#026CDF] to-[#1E40AF] text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
              >
                {category.name}
                {activeCategory === category.id && (
                  <FiChevronRight className="ml-1 md:ml-2" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {debouncedSearchQuery
                  ? `Search Results for "${debouncedSearchQuery}"`
                  : 'Featured Events'}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                {debouncedSearchQuery
                  ? `${filteredEvents.length} events found`
                  : "Don't miss these incredible experiences"}
              </p>
            </div>
          </motion.div>

          {loadingEvents ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-40 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
                <div className="text-center py-12">
              <p className="text-red-500 mb-4 font-medium">{error}</p>
              <button
                onClick={fetchEvents}
                className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-2.5 px-5 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {debouncedSearchQuery
                ? `No events found for "${debouncedSearchQuery}". Try a different search.`
                : 'No events found. Try another category.'}
            </div>
          ) : (
            <>
            <motion.div
              variants={cardStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8"
            >
              {displayedEvents.map(event => (
                <motion.div
                  key={event._id}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#026CDF]/30 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={400}
                      height={300}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-sm text-[#026CDF] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs shadow-lg flex items-center border border-gray-100">
                      <FiStar className="mr-0.5 sm:mr-1 text-[10px] sm:text-xs fill-yellow-400 text-yellow-400" /> {event.rating}
                    </div>
                    {event.seatsLeft < 50 && (
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg">
                        Only {event.seatsLeft} left!
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1.5 sm:gap-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 sm:line-clamp-1 pr-2">{event.title}</h3>
                      <span className="text-[10px] sm:text-xs bg-[#026CDF]/10 text-[#026CDF] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg whitespace-nowrap flex-shrink-0 self-start">
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1 font-medium">{event.artist}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 space-y-1 sm:space-y-0 sm:space-x-2">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1 text-gray-400 sm:mr-1.5" />
                        <span className="font-medium">{formatEventDate(event.date)}</span>
                      </div>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <div className="flex items-center">
                        <FiClock className="mr-1 text-gray-400 sm:mr-1.5" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
                      <FiMapPin className="mr-1 text-gray-400 flex-shrink-0 sm:mr-1.5" />
                      <span className="line-clamp-1 font-medium">{event.venue}, {event.location}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-3 border-t border-gray-100 gap-2 sm:gap-0">
                      <div>
                        <span className="text-base sm:text-lg font-bold text-gray-900">${event.price.toFixed(2)}</span>
                        {event.originalPrice && (
                          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-gray-400 line-through">${event.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleTicketClick(event)}
                        className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl transition duration-200 text-xs sm:text-sm whitespace-nowrap shadow-sm hover:shadow-md w-full sm:w-auto"
                      >
                        Get Tickets
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View More Button */}
            {hasMoreEvents && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>View More Events</span>
                  <FiChevronRight className="h-5 w-5" />
                </motion.button>
              </motion.div>
            )}
            </>
          )}
        </div>
      </motion.section>

      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="py-20 bg-gradient-to-br from-[#026CDF] via-[#1E40AF] to-[#1E3A8A] text-white relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Creating Unforgettable Moments</h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Join thousands of happy customers experiencing the magic of live events
            </p>
          </motion.div>

          <motion.div
            variants={cardStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {/* Tickets Sold Counter */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-center border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white">
                <Counter endValue={12543} duration={2} />
                <span className="text-2xl md:text-3xl">+</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-white/90 uppercase tracking-wide">Tickets Sold</p>
            </motion.div>

            {/* Events Hosted Counter */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-center border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white">
                <Counter endValue={872} duration={2} />
              </div>
              <p className="text-sm md:text-base font-semibold text-white/90 uppercase tracking-wide">Events Hosted</p>
            </motion.div>

            {/* Happy Customers Counter */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-center border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white">
                <Counter endValue={9842} duration={2} />
                <span className="text-2xl md:text-3xl">+</span>
              </div>
              <p className="text-sm md:text-base font-semibold text-white/90 uppercase tracking-wide">Happy Customers</p>
            </motion.div>

            {/* Cities Covered Counter */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 text-center border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 text-white">
                <Counter endValue={56} duration={2} />
              </div>
              <p className="text-sm md:text-base font-semibold text-white/90 uppercase tracking-wide">Cities Covered</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* News Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900">Latest News & Updates</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">Stay informed about upcoming events, exclusive offers, and industry news</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                id: 1,
                title: "Taylor Swift Announces Extended Tour Dates",
                excerpt: "Due to overwhelming demand, Taylor Swift has added 15 additional dates to her Eras Tour across North America.",
                image: "/events/taylor.png",
                date: "2 days ago",
                category: "Concerts"
              },
              {
                id: 2,
                title: "NBA Finals Tickets Now Available",
                excerpt: "Get your tickets early for the 2024 NBA Finals. Premium seats selling fast for this year's championship series.",
                image: "/events/nba.png",
                date: "5 days ago",
                category: "Sports"
              },
              {
                id: 3,
                title: "Hamilton Returns to Broadway",
                excerpt: "The award-winning musical returns with a new cast. Limited run tickets available for advance booking.",
                image: "/events/hamilton.png",
                date: "1 week ago",
                category: "Theater"
              }
            ].map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#026CDF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {news.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#026CDF] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{news.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900">What Our Customers Say</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">Thousands of happy customers have experienced unforgettable moments with our tickets</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                id: 1,
                name: "Sarah Johnson",
                role: "Verified Buyer",
                rating: 5,
                comment: "I got last-minute tickets to see my favorite band at a great price. The mobile tickets worked perfectly and the customer support was excellent when I had questions. Best ticket buying experience ever!",
                avatar: "SJ"
              },
              {
                id: 2,
                name: "Michael Chen",
                role: "Concert Enthusiast",
                rating: 5,
                comment: "EventHorizon made it so easy to find and purchase tickets. The website is clean, fast, and the ticket delivery was instant. Will definitely use again for my next event!",
                avatar: "MC"
              },
              {
                id: 3,
                name: "Emily Rodriguez",
                role: "Theater Lover",
                rating: 5,
                comment: "Amazing service! I was able to get premium seats for Hamilton at the last minute. The process was smooth and the tickets were authentic. Highly recommend to everyone!",
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Stars */}
                <div className="flex items-center mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-8 h-8 text-[#026CDF]/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium">
                    {testimonial.comment}
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center pt-5 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#026CDF] to-[#1E40AF] rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#026CDF] to-[#1E40AF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Never Miss a Show Again</h2>
            <p className="text-white/90 text-base md:text-lg mb-8">Subscribe to get early access to tickets and exclusive deals</p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/95 border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
              />
              <button className="bg-white hover:bg-gray-50 text-[#026CDF] font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;