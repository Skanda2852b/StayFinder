import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../store/slices/bookingSlice';
import { FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const UserBookings = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(getUserBookings());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                        <p className="mt-2 text-gray-300">View and manage your bookings</p>
                    </div>

                    <div className="flex justify-center items-center mt-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                        <p className="mt-2 text-gray-300">View and manage your bookings</p>
                    </div>

                    <div className="mt-4 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:shadow-lg transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
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

                {bookings.length === 0 ? (
                    <div className="text-center mt-8">
                        <p className="text-gray-300">You haven't made any bookings yet.</p>
                        <Link
                            to="/listings"
                            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
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

export default UserBookings; 