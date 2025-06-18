import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // New state for user dropdown
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const dropdownRef = useRef(null); // Ref for detecting outside clicks

    // Handle clicks outside user dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-black border-b border-pink-500/20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0"
                    >
                        <button 
                            onClick={() => navigate('/')} 
                            className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                        >
                            StayFinder
                        </button>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex space-x-8"
                        >
                            <button 
                                onClick={() => navigate('/')} 
                                className="text-gray-300 hover:text-pink-500 transition-colors"
                            >
                                Home
                            </button>
                            <button 
                                onClick={() => navigate('/listings')} 
                                className="text-gray-300 hover:text-violet-500 transition-colors"
                            >
                                Listings
                            </button>
                            {user && (
                                <button 
                                    onClick={() => navigate('/my-bookings')} 
                                    className="text-gray-300 hover:text-orange-500 transition-colors"
                                >
                                    My Bookings
                                </button>
                            )}
                        </motion.div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-300 hover:text-pink-500 transition-colors"
                                    >
                                        <FaUser className="text-lg" />
                                        <span>{user.name}</span>
                                    </motion.button>

                                    <AnimatePresence>
                                        {isUserDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-lg py-2 border border-pink-500/20 z-50"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        navigate('/profile');
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-pink-500/10 hover:text-pink-500 flex items-center space-x-2"
                                                >
                                                    <FaUser className="text-sm" />
                                                    <span>Profile</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-pink-500/10 hover:text-pink-500 flex items-center space-x-2"
                                                >
                                                    <FaSignOutAlt />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="flex space-x-4"
                                >
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-2 text-pink-500 hover:text-pink-400 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                                    >
                                        Register
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-pink-500"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="md:hidden bg-black border-t border-pink-500/20"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <div>
                                <button
                                    onClick={() => {
                                        navigate('/');
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-pink-500/10 hover:text-pink-500 rounded-md"
                                >
                                    Home
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        navigate('/listings');
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-violet-500/10 hover:text-violet-500 rounded-md"
                                >
                                    Listings
                                </button>
                            </div>
                            {user && (
                                <>
                                    <div>
                                        <button
                                            onClick={() => {
                                                navigate('/my-bookings');
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-orange-500/10 hover:text-orange-500 rounded-md"
                                        >
                                            My Bookings
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-pink-500/10 hover:text-pink-500 rounded-md"
                                        >
                                            Profile
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-pink-500/10 hover:text-pink-500 rounded-md flex items-center space-x-2"
                                        >
                                            <FaSignOutAlt />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                            {!user && (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-pink-500 hover:bg-pink-500/10 rounded-md"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/register');
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-center px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;