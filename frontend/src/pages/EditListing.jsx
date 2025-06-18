import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchListingById, updateListing } from '../store/slices/listingSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const EditListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentListing, loading } = useSelector((state) => state.listings);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        images: [],
        amenities: [],
        maxGuests: '',
        bedrooms: '',
        bathrooms: '',
        type: 'hotel',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        availableDates: []
    });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
        price: ''
    });

    useEffect(() => {
        dispatch(fetchListingById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentListing) {
            setFormData({
                title: currentListing.title || '',
                description: currentListing.description || '',
                price: currentListing.price || '',
                location: currentListing.location || '',
                images: currentListing.images || [],
                amenities: currentListing.amenities || [],
                maxGuests: currentListing.maxGuests || '',
                bedrooms: currentListing.bedrooms || '',
                bathrooms: currentListing.bathrooms || '',
                type: currentListing.type || 'hotel',
                checkInTime: currentListing.checkInTime || '14:00',
                checkOutTime: currentListing.checkOutTime || '12:00',
                availableDates: currentListing.availableDates || []
            });
        }
    }, [currentListing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setDateRange(prev => ({
            ...prev,
            startDate: start,
            endDate: end
        }));
    };

    const handleAddDateRange = () => {
        if (!dateRange.startDate || !dateRange.endDate || !dateRange.price) {
            alert('Please fill in all date range fields');
            return;
        }

        setFormData(prev => ({
            ...prev,
            availableDates: [
                ...prev.availableDates,
                {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                    price: parseFloat(dateRange.price)
                }
            ]
        }));

        setDateRange({
            startDate: null,
            endDate: null,
            price: ''
        });
    };

    const handleRemoveDateRange = (index) => {
        setFormData(prev => ({
            ...prev,
            availableDates: prev.availableDates.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateListing({ id, listingData: formData })).unwrap();
            navigate('/host/dashboard');
        } catch (error) {
            console.error('Failed to update listing:', error);
            alert('Failed to update listing. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-lg shadow-lg p-6 border border-pink-500/20"
                >
                    <h1 className="text-3xl font-bold text-white mb-8">Edit Listing</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                                Price per night ($)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300 mb-1">
                                Number of Bedrooms
                            </label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300 mb-1">
                                Number of Bathrooms
                            </label>
                            <input
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Max Guests */}
                        <div>
                            <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-300 mb-1">
                                Maximum Number of Guests
                            </label>
                            <input
                                type="number"
                                id="maxGuests"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Area */}
                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-300 mb-1">
                                Area (sq ft)
                            </label>
                            <input
                                type="number"
                                id="area"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amenities
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'Air Conditioning'].map((amenity) => (
                                    <label key={amenity} className="flex items-center space-x-2 text-gray-300">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value={amenity}
                                            checked={formData.amenities.includes(amenity)}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-600 rounded bg-gray-700"
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Images
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Listing ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                to="/my-listings"
                                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
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
                                    'Save Changes'
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EditListing; 