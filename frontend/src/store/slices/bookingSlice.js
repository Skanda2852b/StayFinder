import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../config";

// Get the port from the backend
const getBackendPort = () => {
    try {
        return require('../../../backend/port.txt');
    } catch (error) {
        return '5000'; // Default port
    }
};

const API_URL_LOCAL = `http://localhost:${getBackendPort()}/api`;

// Create booking
export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Please login to make a booking');
            }

            const response = await axios.post(
                `${API_URL}/bookings`,
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (error) {
            console.error('Create booking error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create booking'
            );
        }
    }
);

// Get user bookings
export const fetchUserBookings = createAsyncThunk(
    'booking/fetchUserBookings',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Please login to view your bookings');
            }

            const response = await axios.get(`${API_URL}/bookings/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (error) {
            console.error('Fetch bookings error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch bookings'
            );
        }
    }
);

// Get booking by ID
export const fetchBookingById = createAsyncThunk(
    'booking/fetchBookingById',
    async (bookingId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Please login to view booking details');
            }

            const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (error) {
            console.error('Fetch booking error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch booking'
            );
        }
    }
);

// Update booking status
export const updateBookingStatus = createAsyncThunk(
    'booking/updateBookingStatus',
    async ({ bookingId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Please login to update booking');
            }

            const response = await axios.patch(
                `${API_URL}/bookings/${bookingId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (error) {
            console.error('Update booking error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update booking'
            );
        }
    }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
    'booking/cancelBooking',
    async (bookingId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Please login to cancel booking');
            }

            const response = await axios.patch(
                `${API_URL}/bookings/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }

            return response.data.data;
        } catch (error) {
            console.error('Cancel booking error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Failed to cancel booking'
            );
        }
    }
);

const initialState = {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    success: false
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.bookings.unshift(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch booking by ID
            .addCase(fetchBookingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBooking = action.payload;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update booking status
            .addCase(updateBookingStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                if (state.currentBooking?._id === action.payload._id) {
                    state.currentBooking = action.payload;
                }
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cancel booking
            .addCase(cancelBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                if (state.currentBooking?._id === action.payload._id) {
                    state.currentBooking = action.payload;
                }
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer; 