import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserBookings, cancelBooking } from '../store/slices/bookingSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaSearch, FaHome, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.booking);

    useEffect(() => {
        dispatch(fetchUserBookings());
    }, [dispatch]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            await dispatch(cancelBooking(bookingId));
            dispatch(fetchUserBookings());
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
                    <p className="mt-4 text-gray-300">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black">
                <div className="bg-black p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-red-500 text-xl mb-6">{error}</p>
                    <button
                        onClick={() => dispatch(fetchUserBookings())}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black p-8 rounded-xl shadow-lg"
                    >
                        <FaSearch className="mx-auto text-6xl text-gray-400 mb-6" />
                        <h1 className="text-3xl font-bold text-white mb-4">No Bookings Found</h1>
                        <p className="text-gray-300 mb-8">You haven't made any bookings yet. Start exploring amazing places to stay!</p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <FaHome className="mr-2" />
                            Browse Listings
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                    <p className="mt-2 text-gray-300">View and manage your bookings</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center mt-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                ) : error ? (
                    <div className="mt-4 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:shadow-lg transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center mt-8">
                        <p className="text-gray-300">You haven't made any bookings yet.</p>
                        <Link
                            to="/listings"
                            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Browse Listings
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-pink-500/20">
                                <div className="relative h-48">
                                    <img
                                        src={booking.listing.images[0]}
                                        alt={booking.listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white">{booking.listing.title}</h3>
                                    <p className="text-gray-300 mt-2">{booking.listing.location}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                            booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                        <span className="text-white font-medium">
                                            ${booking.totalPrice}
                                        </span>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-300">
                                        <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                                        <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                                    </div>
                                    {booking.status === 'pending' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:shadow-lg transition-all duration-300"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings; 