import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiChevronRight, FiAward } from 'react-icons/fi';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TicketDetailModal from '../components/TicketDetailModal';

interface Event {
    _id: string;
    title: string;
    playwright?: string;
    director?: string;
    cast?: string[];
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
    duration?: string;
    type?: 'play' | 'musical' | 'opera' | 'ballet';
}

interface CartItem {
    id: string;
    type: string;
    quantity: number;
    cartKey: string;
    title: string;
    price: number;
}

const TheaterPage = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<'all' | Event['type']>('all');

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            // Filter events to only include theater
            const theaterEvents = data.events.filter((event: Event) => event.category === 'theater');
            setEvents(theaterEvents || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load theater events. Please try again later.');
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

    // Filter by theater type
    const filteredEvents = activeType === 'all'
        ? events
        : events.filter(event => event.type === activeType);

    const theaterTypes = [
        { id: 'all', name: 'All Performances' },
        { id: 'play', name: 'Plays' },
        { id: 'musical', name: 'Musicals' },
        { id: 'opera', name: 'Opera' },
        { id: 'ballet', name: 'Ballet' }
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
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/80 to-amber-900/80 z-10"></div>
                {/* Replace the Image component with a video element */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/events/theater.mp4" type="video/mp4" />
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500">Theater</span> Magic
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                            Experience the drama, music, and spectacle of live performances
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
                        <h2 className="text-3xl font-bold mb-4">Current & Upcoming Shows</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Find your next night at the theater</p>
                    </motion.div>

                    {/* Theater Type Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {theaterTypes.map(type => (
                            <motion.button
                                key={type.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveType(type.id as any)}
                                className={`px-6 py-3 rounded-full font-medium transition duration-300 flex items-center ${activeType === type.id
                                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {type.name}
                                {activeType === type.id && (
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
                                className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-medium py-2 px-4 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No theater events found. Check back later for new shows.
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
                                        <div className="absolute top-4 right-4 bg-white text-red-500 font-bold px-3 py-1 rounded-full text-sm shadow flex items-center">
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
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Theater'}
                                            </span>
                                        </div>

                                        {event.playwright && <p className="text-gray-600 mb-1">By {event.playwright}</p>}
                                        {event.director && <p className="text-gray-600 text-sm">Directed by {event.director}</p>}

                                        <div className="flex items-center text-sm text-gray-500 mb-4 mt-2">
                                            <FiCalendar className="mr-1" />
                                            {formatEventDate(event.date)}
                                            <span className="mx-2">•</span>
                                            <FiClock className="mr-1" />
                                            {event.time}
                                            {event.duration && (
                                                <>
                                                    <span className="mx-2">•</span>
                                                    {event.duration}
                                                </>
                                            )}
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
                                                className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
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

            <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
                {/* Theater Curtain Effect */}
                <div className="absolute inset-0 z-0 flex justify-between pointer-events-none">
                    <div className="w-1/4 h-full bg-gradient-to-r from-red-900/80 to-transparent"></div>
                    <div className="w-1/4 h-full bg-gradient-to-l from-red-900/80 to-transparent"></div>
                </div>

                {/* Spotlight Effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-yellow-500/5 filter blur-3xl z-0"></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Theatrical</span> Masterpieces
                        </h2>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            Where every curtain rise unveils a world of drama and wonder
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Broadway Hits",
                                description: "Tony Award-winning productions",
                                icon: "🎭",
                                highlight: "Orchestra seating available"
                            },
                            {
                                title: "Classical Ballet",
                                description: "Timeless stories through dance",
                                icon: "🩰",
                                highlight: "Post-show receptions"
                            },
                            {
                                title: "Shakespearean",
                                description: "The Bard's works under the stars",
                                icon: "📜",
                                highlight: "Open-air performances"
                            }
                        ].map((show, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-amber-400/30 transition-all"
                            >
                                <div className="p-8 h-full flex flex-col items-center text-center">
                                    <div className="text-5xl mb-6 text-amber-300">{show.icon}</div>
                                    <h3 className="font-bold text-2xl mb-2">{show.title}</h3>
                                    <p className="text-white/80 mb-4 italic">{show.description}</p>
                                    <div className="mt-auto pt-4 border-t border-white/10 w-full">
                                        <p className="text-sm font-medium text-amber-300">{show.highlight}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Theater Mask Decoration */}
                    <motion.div
                        className="flex justify-center mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-6xl" style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.7)' }}>
                            🎭
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-r from-amber-500 to-red-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">Join Our Theater Community</h2>
                        <p className="text-white/90 text-xl mb-8">Get exclusive access to behind-the-scenes content and early ticket sales</p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                            <button className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg">
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

export default TheaterPage;