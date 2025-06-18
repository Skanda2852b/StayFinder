import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ListingCard = ({ listing }) => {
    // Get the first available image
    const mainImage = listing.images?.[0] || listing.image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                to={`/listings/${listing._id}`}
                className="group bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
                <div className="relative">
                    {mainImage ? (
                        <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            src={mainImage}
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full shadow-lg"
                    >
                        <span className="text-white font-semibold">${listing.price}</span>
                        <span className="text-gray-200 text-sm"> / night</span>
                    </motion.div>
                </div>
                <div className="p-6">
                    <motion.h3
                        whileHover={{ color: "#EC4899" }}
                        className="text-xl font-semibold text-white mb-2 group-hover:text-pink-500 transition-colors"
                    >
                        {listing.title}
                    </motion.h3>
                    <p className="text-gray-400 mb-4">{listing.location}</p>
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full"
                        >
                            <FaStar className="text-white" />
                            <span className="text-white text-sm">4.8</span>
                        </motion.div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="bg-gradient-to-r from-violet-500 to-purple-500 px-3 py-1 rounded-full text-white">
                                {listing.bedrooms} beds
                            </span>
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 rounded-full text-white">
                                {listing.bathrooms} baths
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ListingCard; 