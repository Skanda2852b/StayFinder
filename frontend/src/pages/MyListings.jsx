import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserListings } from '../store/slices/listingSlice';
import { FaEdit, FaTrash, FaPlus, FaHome, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MyListings = () => {
    const dispatch = useDispatch();
    const { userListings, loading, error } = useSelector((state) => state.listing);

    useEffect(() => {
        dispatch(fetchUserListings());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                    >
                        <p>{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch(fetchUserListings())}
                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300"
                        >
                            Retry
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-white"
                    >
                        My Listings
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            to="/create-listing"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg transition-all duration-300"
                        >
                            <FaPlus className="mr-2" />
                            Create New Listing
                        </Link>
                    </motion.div>
                </div>

                {userListings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                            <FaHome className="w-8 h-8 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Listings Yet</h3>
                        <p className="text-gray-300 mb-6">Start by creating your first listing</p>
                        <Link
                            to="/create-listing"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg transition-all duration-300"
                        >
                            <FaPlus className="mr-2" />
                            Create New Listing
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {userListings.map((listing) => (
                            <motion.div
                                key={listing._id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-pink-500/20"
                            >
                                <Link to={`/listings/${listing._id}`}>
                                    <div className="relative h-48">
                                        <img
                                            src={listing.images?.[0] || listing.image}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                                            ${listing.price}/night
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
                                        <p className="text-gray-300 mt-1">{listing.location}</p>
                                        <div className="mt-2 flex items-center text-gray-300">
                                            <FaStar className="text-yellow-400 mr-1" />
                                            <span>{listing.rating || 'New'}</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="px-4 pb-4 flex justify-between">
                                    <Link
                                        to={`/edit-listing/${listing._id}`}
                                        className="text-pink-500 hover:text-pink-400 transition-colors"
                                    >
                                        <FaEdit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => {/* TODO: Implement delete functionality */}}
                                        className="text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        <FaTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyListings; 