import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingById } from "../store/slices/listingSlice";
import { createBooking } from "../store/slices/bookingSlice";
import { FaBed, FaBath, FaRuler, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaStar, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentListing, loading, error } = useSelector((state) => state.listing);
  const { user } = useSelector((state) => state.auth);
  const { loading: bookingLoading } = useSelector((state) => state.booking);
  const [bookingData, setBookingData] = useState({ checkIn: "", checkOut: "", guests: 1 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchListingById(id));
  }, [dispatch, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        createBooking({
          listingId: id,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          numberOfGuests: bookingData.guests,
        })
      ).unwrap();
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle image loading state
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex justify-center items-center h-screen">
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
    );
  }

  if (error || !currentListing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-8 rounded-xl shadow-lg text-center max-w-md border border-violet-500"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-violet-500 text-5xl mb-4"
          >
            🏠
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">Listing Not Found</h2>
          <p className="text-gray-400 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    location,
    images = [],
    image,
    amenities = [],
    host = {},
    bedrooms,
    bathrooms,
    area,
    maxGuests = 4,
    rating = 0,
  } = currentListing;

  // Combine all images into a single array
  const allImages = images?.length > 0 ? images : image ? [image] : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          {/* Main Image */}
          <div className="relative h-[60vh] rounded-xl overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={title}
                className={`w-full h-full object-cover ${imagesLoaded ? '' : 'blur-sm'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onLoad={handleImageLoad}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                }}
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {title}
              </motion.h1>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center text-gray-300"
              >
                <FaMapMarkerAlt className="mr-2 text-pink-500" />
                <span>{location}</span>
              </motion.div>
            </div>
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentImageIndex === 0}
                  onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                  className={`p-2 rounded-full ${currentImageIndex === 0 ? 'bg-gray-700/50' : 'bg-gray-800/70 hover:bg-pink-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentImageIndex === allImages.length - 1}
                  onClick={() => setCurrentImageIndex(prev => Math.min(allImages.length - 1, prev + 1))}
                  className={`p-2 rounded-full ${currentImageIndex === allImages.length - 1 ? 'bg-gray-700/50' : 'bg-gray-800/70 hover:bg-pink-500'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-4 gap-2"
            >
              {allImages.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-pink-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                    }}
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-pink-500/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center text-gray-300 bg-gray-900/30 p-3 rounded-lg"
                >
                  <FaBed className="mr-2 text-pink-500" />
                  <span>{bedrooms} Bedrooms</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center text-gray-300 bg-gray-900/30 p-3 rounded-lg"
                >
                  <FaBath className="mr-2 text-purple-500" />
                  <span>{bathrooms} Bathrooms</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center text-gray-300 bg-gray-900/30 p-3 rounded-lg"
                >
                  <FaRuler className="mr-2 text-violet-500" />
                  <span>{area} sq ft</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center text-gray-300 bg-gray-900/30 p-3 rounded-lg"
                >
                  <FaUsers className="mr-2 text-blue-500" />
                  <span>Up to {maxGuests} guests</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-pink-500/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 whitespace-pre-line">{description}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-pink-500/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center text-gray-300 bg-gray-900/30 p-3 rounded-lg"
                  >
                    <FaCheck className="mr-2 text-pink-500" />
                    <span>{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Host Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Host Information</h2>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500/50">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-900"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">{host.name}</h3>
                  <p className="text-gray-300">Member since {new Date(host.joinDate).getFullYear()}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-white">${price}</span>
                  <span className="text-gray-300"> / night</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{rating || 'New'}</span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-300 mb-1">
                    Check-in
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={bookingData.checkIn}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-300 mb-1">
                    Check-out
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={bookingData.checkOut}
                      onChange={handleChange}
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                >
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-300 mb-1">
                    Guests
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      id="guests"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
                      required
                    >
                      {[...Array(maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!user || bookingLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    'Book Now'
                  )}
                </motion.button>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center text-gray-300"
              >
                <p>You won't be charged yet</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;