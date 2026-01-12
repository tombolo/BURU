import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TicketDetailModal from '../components/TicketDetailModal';

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

const ConcertsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            // Filter events to only include concerts
            const concertEvents = data.events.filter((event: Event) => event.category === 'concerts');
            setEvents(concertEvents || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load concerts. Please try again later.');
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

            <section className="relative h-[60vh] overflow-hidden ">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 to-blue-900/80 z-10"></div>
                {/* Replace the Image component with a video element */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/events/concert.mp4" type="video/mp4" />
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
                        className="max-w-6xl mx-auto text-center mt-10"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Live Music</span> Like Never Before
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
                            Discover the hottest concerts and music festivals happening near you
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
                        <h2 className="text-3xl font-bold mb-4">Upcoming Concerts</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Find your next unforgettable musical experience</p>
                    </motion.div>

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
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium py-2 px-4 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No concerts found. Check back later for new events.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map(event => (
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
                                        <div className="absolute top-4 right-4 bg-white text-orange-500 font-bold px-3 py-1 rounded-full text-sm shadow flex items-center">
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
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Concert
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mb-1">{event.artist}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FiCalendar className="mr-1" />
                                            {formatEventDate(event.date)}
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
                                                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium py-2 px-4 rounded-lg transition duration-300"
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

            <section className="py-20 bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
                {/* Stage Light Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-yellow-500/10 to-transparent transform -skew-x-12"></div>
                    <div className="absolute top-0 left-1/3 w-1/3 h-full bg-gradient-to-b from-blue-500/10 to-transparent transform skew-x-12"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400">Live Concerts</span> That Electrify
                        </h2>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            Feel the bass in your chest and the crowd's energy all around you
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Rock Legends",
                                vibe: "Mosh pits & guitar solos",
                                icon: "🎸",
                                highlight: "Pyro shows included"
                            },
                            {
                                title: "EDM Experience",
                                vibe: "Laser light spectacular",
                                icon: "🔊",
                                highlight: "Dance floor access"
                            },
                            {
                                title: "Acoustic Sessions",
                                vibe: "Intimate & unplugged",
                                icon: "🎶",
                                highlight: "Meet-and-greet passes"
                            }
                        ].map((concert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all"
                            >
                                <div className="p-8 h-full flex flex-col items-center text-center">
                                    <div className="text-5xl mb-6">{concert.icon}</div>
                                    <h3 className="font-bold text-2xl mb-2 text-yellow-400">{concert.title}</h3>
                                    <p className="text-white/80 mb-4">{concert.vibe}</p>
                                    <div className="mt-auto pt-4 border-t border-white/10 w-full">
                                        <p className="text-sm font-medium text-yellow-300">{concert.highlight}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Audio Wave Animation */}
                    <motion.div
                        className="flex justify-center space-x-1 mt-16 h-12 items-end"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {[2, 4, 6, 8, 10, 8, 6, 4, 2].map((height, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-yellow-400 rounded-t-sm"
                                initial={{ height: 4 }}
                                animate={{ height: [4, height, 4] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default ConcertsPage;