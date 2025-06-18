import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBooking, clearError } from "../store/slices/bookingSlice";
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const BookingForm = ({ listing }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalNights(nights);
      setTotalPrice(nights * listing.price);
    }
  }, [formData.checkIn, formData.checkOut, listing.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const validateForm = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setFormError("Please select check-in and check-out dates");
      return false;
    }

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setFormError("Check-in date cannot be in the past");
      return false;
    }

    if (end <= start) {
      setFormError("Check-out date must be after check-in date");
      return false;
    }

    if (formData.guests < 1) {
      setFormError("Number of guests must be at least 1");
      return false;
    }

    if (formData.guests > listing.maxGuests) {
      setFormError(`Maximum ${listing.maxGuests} guests allowed`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    const bookingData = {
      listingId: listing._id,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      totalPrice,
      totalNights,
    };

    const result = await dispatch(createBooking(bookingData));
    if (!result.error) {
      navigate("/my-bookings");
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black p-6 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <FaInfoCircle className="mx-auto text-4xl text-pink-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">Login Required</h3>
          <p className="text-gray-300 mb-4">
            Please log in to make a booking
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Log In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-pink-500/20">
      <h2 className="text-2xl font-bold text-white mb-6">Book Your Stay</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-300 mb-1">
            Check-in Date
          </label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-300 mb-1">
            Check-out Date
          </label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-300 mb-1">
            Number of Guests
          </label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max={listing.maxGuests}
            className="w-full px-3 py-2 bg-gray-700 border border-pink-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between text-gray-300">
            <span>${listing.price} x {totalNights} nights</span>
            <span>${listing.price * totalNights}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Service fee</span>
            <span>${listing.serviceFee}</span>
          </div>
          <div className="border-t border-pink-500/20 pt-4">
            <div className="flex justify-between text-white font-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Book Now'
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

