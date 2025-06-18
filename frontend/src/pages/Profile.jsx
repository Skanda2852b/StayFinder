import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/slices/authSlice';
import { FaUser, FaCalendarAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user data from Redux store
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // If user is not in store but we have a token, fetch user data
        if (!user && isAuthenticated) {
          await dispatch(getCurrentUser()).unwrap();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error, redirect to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, user, isAuthenticated, navigate]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-pink-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl text-white font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
            Manage your account information and view booking history
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-pink-500/30 shadow-xl overflow-hidden mb-12"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-6xl text-pink-500">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">{user?.name || 'User'}</h1>
                <div className="mt-4 flex items-center justify-center md:justify-start gap-3 text-gray-300">
                  <FaEnvelope className="text-pink-500" />
                  <span className="text-lg">{user?.email || 'No email'}</span>
                </div>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-3 text-gray-300">
                  <FaClock className="text-purple-500" />
                  <span className="text-lg">
                    Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </span>
                  Personal Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400">Full Name</p>
                    <p className="text-white text-lg font-medium">{user?.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Contact Email</p>
                    <p className="text-white text-lg font-medium">{user?.email || 'Not set'}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <FaClock className="text-white text-sm" />
                  </span>
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400">Member Since</p>
                    <p className="text-white text-lg font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Account Status</p>
                    <p className="text-green-500 text-lg font-medium">Active</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-sm" />
                  </span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={() => navigate('/my-listings')}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all"
                  >
                    View My Listings
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Quick Stats Section */}
            <div className="border-t border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-pink-500" />
                Account Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-3xl font-bold text-pink-500 mb-2">
                    {user?.bookings?.length || 0}
                  </div>
                  <div className="text-gray-400">Total Bookings</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {user?.listings?.length || 0}
                  </div>
                  <div className="text-gray-400">My Listings</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {user?.bookings?.filter(b => b.status === 'confirmed').length || 0}
                  </div>
                  <div className="text-gray-400">Confirmed Bookings</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 text-center"
                >
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {user?.bookings?.filter(b => b.status === 'pending').length || 0}
                  </div>
                  <div className="text-gray-400">Pending Bookings</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;