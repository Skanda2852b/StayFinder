import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchHostBookings, updateBookingStatus } from '../store/slices/bookingSlice';
import { FaSpinner, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const HostDashboard = () => {
    const dispatch = useDispatch();
    const { bookings, loading, error } = useSelector((state) => state.bookings);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        dispatch(fetchHostBookings());
    }, [dispatch]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
            // Refresh the bookings list
            dispatch(fetchHostBookings());
        } catch (error) {
            console.error('Failed to update booking status:', error);
        }
    };

    const filteredBookings = selectedStatus === 'all'
        ? bookings
        : bookings.filter(booking => booking.status === selectedStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
                        <p className="mt-2 text-gray-300">Manage your listings and bookings</p>
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
                        <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
                        <p className="mt-2 text-gray-300">Manage your listings and bookings</p>
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
                    <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
                    <p className="mt-2 text-gray-300">Manage your listings and bookings</p>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {/* Listings Section */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-pink-500/20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">Your Listings</h2>
                            <Link
                                to="/create-listing"
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                                Add New Listing
                            </Link>
                        </div>
                        {listings.length === 0 ? (
                            <p className="text-gray-300">You haven't created any listings yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {listings.map((listing) => (
                                    <div key={listing._id} className="bg-gray-700 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-white">{listing.title}</h3>
                                        <p className="text-gray-300 mt-1">{listing.location}</p>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-white font-medium">${listing.price}/night</span>
                                            <Link
                                                to={`/edit-listing/${listing._id}`}
                                                className="text-pink-500 hover:text-pink-400"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bookings Section */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-pink-500/20">
                        <h2 className="text-xl font-semibold text-white mb-6">Recent Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="text-gray-300">No bookings yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking._id} className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-white">{booking.listing.title}</h3>
                                                <p className="text-gray-300 mt-1">
                                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                        className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded hover:shadow-lg transition-all duration-300"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                        className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded hover:shadow-lg transition-all duration-300"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard; 