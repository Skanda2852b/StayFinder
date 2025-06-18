import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchListings } from "../store/slices/listingSlice";
import { FaSearch, FaMapMarkerAlt, FaUsers, FaStar, FaBed, FaBath, FaHome, FaHotel } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const dispatch = useDispatch();
    const { listings = [], loading, error } = useSelector((state) => state.listing);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [searchParams, setSearchParams] = useState({
        location: "",
        checkIn: "",
        checkOut: "",
        sortBy: "price_asc"
    });

    const [showFilters, setShowFilters] = useState(false);
    const [filteredListings, setFilteredListings] = useState([]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    useEffect(() => {
        dispatch(fetchListings());
    }, [dispatch]);

    useEffect(() => {
        if (listings) {
            filterListings();
        }
    }, [searchParams, listings]);

    const filterListings = () => {
        if (!listings) return;

        let filtered = [...listings];

        // Filter by location
        if (searchParams.location) {
            filtered = filtered.filter(listing => 
                listing.location?.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }

        // Filter by check-in date
        if (searchParams.checkIn) {
            filtered = filtered.filter(listing => {
                const listingDate = new Date(listing.availableFrom);
                const checkInDate = new Date(searchParams.checkIn);
                return listingDate <= checkInDate;
            });
        }

        // Filter by check-out date
        if (searchParams.checkOut) {
            filtered = filtered.filter(listing => {
                const listingDate = new Date(listing.availableTo);
                const checkOutDate = new Date(searchParams.checkOut);
                return listingDate >= checkOutDate;
            });
        }

        // Sort listings
        switch (searchParams.sortBy) {
            case 'price_asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating_desc':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        setFilteredListings(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = () => {
        filterListings();
    };

    const handleAmenityToggle = (amenity) => {
        setSearchParams(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            priceRange: [
                name === 'minPrice' ? parseInt(value) : prev.priceRange[0],
                name === 'maxPrice' ? parseInt(value) : prev.priceRange[1]
            ]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
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
                    className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black p-8 rounded-lg shadow-lg border border-pink-500/20"
                >
                    <h2 className="text-2xl font-bold text-pink-500 mb-4">Error</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(fetchListings())}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg"
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full">
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Luxury Home"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Find Your Dream Home
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 mb-8 max-w-2xl"
                    >
                        Discover the perfect place to stay with our curated selection of luxury properties
                    </motion.p>

                    {/* Search Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full max-w-4xl bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-pink-500/20 shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={searchParams.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-pink-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={searchParams.checkIn}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={searchParams.checkOut}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSearch}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                                Search
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Listings Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Featured Listings</h2>
                    <div className="flex space-x-4">
                        <select
                            value={searchParams.sortBy}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, sortBy: e.target.value }))}
                            className="px-4 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating_desc">Top Rated</option>
                        </select>
                    </div>
                </div>
                {loading ? (
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
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                    >
                        <p>{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch(fetchListings())}
                            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300"
                        >
                            Retry
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredListings.map((listing) => (
                            <motion.div
                                key={listing._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-black rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
                            >
                                <Link to={`/listings/${listing._id}`}>
                                    <div className="relative h-64 group">
                                        <img
                                            src={listing.image}
                                            alt={listing.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center space-x-2">
                                                <FaBed className="text-pink-500" />
                                                <span>{listing.bedrooms} beds</span>
                                                <FaBath className="text-pink-500 ml-2" />
                                                <span>{listing.hasBathroom ? '1' : '0'} baths</span>
                                            </div>
                                        </div>
                                        {listing.image && (
                                            <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 text-white text-sm">
                                                +{listing.image.length - 1} more
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-white truncate">{listing.title}</h3>
                                            <div className="flex items-center">
                                                <FaStar className="text-yellow-400 mr-1" />
                                                <span className="text-white">{listing.rating || 'New'}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2 truncate">{listing.location}</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-pink-500 font-semibold">${listing.price.toLocaleString()}</span>
                                            </div>
                                            <span className="text-gray-400 text-sm">{listing.type}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Call to Action */}
            <div className="bg-gray-800 mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                    >
                        <span className="block">Ready to list your property?</span>
                        <span className="block text-pink-500">Start hosting today.</span>
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
                    >
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                to="/create-listing"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg transition-all duration-300"
                            >
                                Get started
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home; 