import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../store/slices/listingSlice';

const CreateListing = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, errorDetails } = useSelector((state) => state.listings);
    const [localError, setLocalError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        image: '',
        amenities: [],
        maxGuests: '1',
        bedrooms: '1',
        hasBathroom: true,
        type: 'hotel'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setLocalError(''); // Clear local error when user makes changes
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setLocalError('Please upload an image file (JPEG, PNG, or GIF)');
                return;
            }
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setLocalError('Image size must be less than 10MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
                setLocalError(''); // Clear local error on successful upload
            };
            reader.onerror = () => {
                setLocalError('Error reading the image file');
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setLocalError('Title is required');
            return false;
        }
        if (!formData.description.trim()) {
            setLocalError('Description is required');
            return false;
        }
        if (!formData.price || formData.price <= 0) {
            setLocalError('Price must be greater than 0');
            return false;
        }
        if (!formData.location.trim()) {
            setLocalError('Location is required');
            return false;
        }
        if (!formData.image) {
            setLocalError('Please upload an image for the listing');
            return false;
        }
        if (!formData.maxGuests || formData.maxGuests < 1) {
            setLocalError('Maximum guests must be at least 1');
            return false;
        }
        if (!formData.bedrooms || formData.bedrooms < 0) {
            setLocalError('Number of bedrooms must be 0 or greater');
            return false;
        }
        if (!formData.type) {
            setLocalError('Property type is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            // Convert string values to appropriate types
            const processedData = {
                ...formData,
                price: Number(formData.price),
                maxGuests: Number(formData.maxGuests),
                bedrooms: Number(formData.bedrooms),
                hasBathroom: Boolean(formData.hasBathroom),
                amenities: Array.isArray(formData.amenities) ? formData.amenities : []
            };
            
            console.log('Submitting listing data:', {
                ...processedData,
                image: processedData.image ? `${processedData.image.substring(0, 50)}...` : 'none'
            });
            
            await dispatch(createListing(processedData)).unwrap();
            navigate('/host-dashboard');
        } catch (error) {
            console.error('Failed to create listing:', error);
            setLocalError(
                error.details 
                    ? `${error.message}: ${error.details}`
                    : error.message || 'Failed to create listing. Please try again.'
            );
        }
    };

    // Combine local and Redux errors
    const displayError = localError || error;
    const errorMessage = errorDetails?.details 
        ? `${displayError}: ${errorDetails.details}`
        : displayError;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create Hotel Listing</h1>
            
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <div className="font-bold">Error:</div>
                    <div>{errorMessage}</div>
                    {errorDetails?.status && (
                        <div className="mt-2 text-sm">
                            Status: {errorDetails.status}
                        </div>
                    )}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-black rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter hotel name"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe your hotel"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter hotel location"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price per Night
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter price per night"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
                                Max Guests
                            </label>
                            <input
                                type="number"
                                id="maxGuests"
                                name="maxGuests"
                                value={formData.maxGuests}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                                Bedrooms
                            </label>
                            <input
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="hotel">Hotel</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Has Bathroom
                        </label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="hasBathroom"
                                    checked={formData.hasBathroom}
                                    onChange={handleChange}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Yes</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                        {formData.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.image}
                                    alt="Property preview"
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Creating...' : 'Create Listing'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateListing; 