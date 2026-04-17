import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiChevronRight, FiMusic } from 'react-icons/fi';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TicketDetailModal from '../components/TicketDetailModal';

interface Event {
    _id: string;
    title: string;
    artist?: string;
    genre?: string;
    description?: string;
    date: string;
    endDate?: string;
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

const FestivalsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeGenre, setActiveGenre] = useState('all');

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            // Filter events to only include festivals
            const festivalEvents = data.events.filter((event: Event) => event.category === 'festivals');
            setEvents(festivalEvents || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load festivals. Please try again later.');
            setEvents([]);
        } finally {
            setLoadingEvents(false);
        }
    };

    useEffect(() => {
        fetchEvents();
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

    const formatDateRange = (startDate: string, endDate?: string) => {
        if (!endDate) return formatEventDate(startDate);

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start.getMonth() === end.getMonth()) {
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.getDate()}, ${start.getFullYear()}`;
        } else {
            return `${formatEventDate(startDate)} - ${formatEventDate(endDate)}`;
        }
    };

    // Filter by genre if needed
    const filteredEvents = activeGenre === 'all'
        ? events
        : events.filter(event => event.genre?.toLowerCase() === activeGenre.toLowerCase());

    const festivalGenres = [
        { id: 'all', name: 'All Festivals' },
        { id: 'music', name: 'Music' },
        { id: 'food', name: 'Food & Drink' },
        { id: 'film', name: 'Film' },
        { id: 'art', name: 'Art' },
        { id: 'cultural', name: 'Cultural' }
    ];

    return (
        <>
            <Header cart={cart} />

            {showModal && selectedEvent && (
                <TicketDetailModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}

            <section className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-pink-700/80 z-10"></div>
                {/* Replace the Image component with a video element */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/events/festival.mp4" type="video/mp4" />
                        {/* Fallback image if video doesn't load */}
                        <Image
                            src="/events/sport.png"
                            alt="Sports banner"
                            fill
                            className="object-cover"
                            priority
                        />
                    </video>
                <div className="relative z-20 h-full flex flex-col justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Festival</span> Experiences
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                            Immerse yourself in unforgettable multi-day celebrations
                        </p>
                    </motion.div>
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
                        <h2 className="text-3xl font-bold mb-4">Upcoming Festivals</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Discover your next adventure</p>
                    </motion.div>

                    {/* Festival Genre Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {festivalGenres.map(genre => (
                            <motion.button
                                key={genre.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveGenre(genre.id)}
                                className={`px-6 py-3 rounded-full font-medium transition duration-300 flex items-center ${activeGenre === genre.id
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {genre.name}
                                {activeGenre === genre.id && (
                                    <FiChevronRight className="ml-2" />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {loadingEvents ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                                    <div className="animate-pulse">
                                        <div className="bg-gray-200 h-48 w-full"></div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchEvents}
                                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-2 px-4 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No festivals found. Check back later for new events.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map(event => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                                >
                                    <div className="relative">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            width={400}
                                            height={300}
                                            className="w-full h-48 object-cover"
                                            priority={false}
                                        />
                                        <div className="absolute top-4 right-4 bg-white text-purple-600 font-bold px-3 py-1 rounded-full text-sm shadow flex items-center">
                                            <FiStar className="mr-1" /> {event.rating}
                                        </div>
                                        {event.seatsLeft < 50 && (
                                            <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                Only {event.seatsLeft} left!
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                                            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                                                {event.genre || 'Festival'}
                                            </span>
                                        </div>

                                        {event.artist && <p className="text-gray-600 mb-1">Featuring {event.artist}</p>}

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FiCalendar className="mr-1" />
                                            {formatDateRange(event.date, event.endDate)}
                                            <span className="mx-2">•</span>
                                            <FiClock className="mr-1" />
                                            {event.time}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FiMapPin className="mr-1" />
                                            {event.venue}, {event.location}
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">${event.price.toFixed(2)}</span>
                                                {event.originalPrice && (
                                                    <span className="ml-2 text-sm text-gray-500 line-through">${event.originalPrice.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleTicketClick(event)}
                                                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                                            >
                                                Get Tickets
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/festival-crowd.jpg')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-indigo-900/80"></div>
                </div>

                {/* Floating particles for festival vibe */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full animate-float"
                            style={{
                                background: `rgba(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 20 + 10}s`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400">
                            Festival Magic Awaits
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Immerse yourself in unforgettable moments under the open sky
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Headliner Nights",
                                description: "Front row to the biggest acts of the season",
                                highlight: "Pyrotechnics & special effects included",
                                icon: "🎤",
                                color: "from-pink-500 to-purple-600"
                            },
                            {
                                title: "VIP Oasis",
                                description: "Exclusive lounge with premium amenities",
                                highlight: "Private bars and premium viewing",
                                icon: "🌟",
                                color: "from-yellow-400 to-orange-500"
                            },
                            {
                                title: "Campground Pass",
                                description: "Wake up to music in our curated camping village",
                                highlight: "Morning yoga & artist meetups",
                                icon: "⛺",
                                color: "from-green-400 to-teal-600"
                            }
                        ].map((experience, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                                className={`bg-gradient-to-br ${experience.color} rounded-2xl overflow-hidden shadow-2xl`}
                            >
                                <div className="p-8 h-full flex flex-col">
                                    <div className="text-5xl mb-6 text-center">{experience.icon}</div>
                                    <h3 className="font-bold text-2xl mb-3 text-center">{experience.title}</h3>
                                    <p className="text-white/90 mb-4 text-center">{experience.description}</p>
                                    <div className="mt-auto pt-4 border-t border-white/20">
                                        <p className="text-white/80 text-sm font-medium text-center">{experience.highlight}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Festival vibe footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center mt-16"
                    >
                        <p className="text-lg text-white/80 mb-4">The beat goes on...</p>
                        <div className="flex justify-center space-x-1">
                            {['🎪', '🎡', '🎷', '🥁', '🎨', '🌈', '🎭'].map((emoji, i) => (
                                <motion.span
                                    key={i}
                                    className="text-3xl inline-block"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, Math.random() > 0.5 ? 10 : -10, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.2
                                    }}
                                >
                                    {emoji}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Add this to your global CSS */}
                <style jsx>{`
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
            100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
            animation-name: float;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
        }
    `}</style>
            </section>

            <section className="py-16 bg-gradient-to-r from-yellow-400 to-pink-500">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">Get Festival Updates</h2>
                        <p className="text-white/90 text-xl mb-8">Be the first to know about lineup announcements and early bird tickets</p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <button className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg">
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

export default FestivalsPage;