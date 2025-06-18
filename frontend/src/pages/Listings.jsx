import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchListings } from '../store/slices/listingSlice';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Listings = () => {
    const dispatch = useDispatch();
    const { listings, loading } = useSelector((state) => state.listing);

    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Discover Stays</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700"
                            >
                                <div className="bg-gray-700 h-60 w-full animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4"
                    >
                        Discover Stays
                    </motion.h1>
                    <motion.p 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        Find your perfect getaway from our curated collection of unique stays
                    </motion.p>
                </div>
                
                {listings.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {listings.map((listing) => (
                            <motion.div
                                key={listing._id}
                                whileHover={{ y: -10 }}
                                className="relative"
                            >
                                <Link
                                    to={`/listings/${listing._id}`}
                                    className="block h-full"
                                >
                                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700 h-full flex flex-col hover:shadow-xl hover:border-pink-500/50 transition-all duration-300">
                                        <div className="relative">
                                            {listing.image ? (
                                                <img
                                                    src={listing.image}
                                                    alt={listing.title}
                                                    className="w-full h-60 object-cover"
                                                />
                                            ) : (
                                                <div className="bg-gradient-to-br from-gray-700 to-gray-900 w-full h-60 flex items-center justify-center">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                            <button 
                                                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:text-pink-500 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Handle save functionality
                                                }}
                                            >
                                                <FaHeart />
                                            </button>
                                        </div>
                                        <div className="p-5 flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-bold text-white line-clamp-1">{listing.title}</h3>
                                                <div className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 rounded-full">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-white ml-1 font-medium">{listing.rating || 'New'}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 mb-4 flex items-center">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-5 w-5 mr-1 text-pink-500" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                                    />
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                                    />
                                                </svg>
                                                {listing.location}
                                            </p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-2xl font-bold text-white">
                                                        ${listing.price}
                                                        <span className="text-gray-400 text-base font-normal">/night</span>
                                                    </span>
                                                    <span className="text-gray-400 text-sm">
                                                        {listing.guests} guest{listing.guests !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl p-12 max-w-2xl mx-auto">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-20 w-20 mx-auto text-gray-600 mb-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                                />
                            </svg>
                            <h3 className="text-2xl font-bold text-gray-300 mb-4">No Listings Available</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                We couldn't find any properties matching your criteria. Check back soon for new listings!
                            </p>
                            <button
                                onClick={() => dispatch(fetchListings())}
                                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl text-white font-medium transition-all"
                            >
                                Refresh Listings
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Listings;