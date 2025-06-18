import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:5000/api";

// Helper function to get the API URL
const getApiUrl = () => {
    // Try to get the port from localStorage, fallback to 5000
    const port = localStorage.getItem('apiPort') || '5000';
    return `http://localhost:${port}/api`;
};

// Helper function to extract error details
const getErrorDetails = (error) => {
    if (error.response) {
        // Server responded with error
        return {
            message: error.response.data.message || error.message,
            details: error.response.data.details || error.response.data.error,
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'No response from server',
            details: 'The server is not responding. Please try again later.',
            status: 'NETWORK_ERROR'
        };
    } else {
        // Error in request setup
        return {
            message: error.message,
            details: 'Error in setting up the request',
            status: 'REQUEST_SETUP_ERROR'
        };
    }
};

// Get all listings
export const fetchListings = createAsyncThunk(
    'listing/fetchListings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/listings`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch listings"
            );
        }
    }
);

// Get single listing
export const fetchListingById = createAsyncThunk(
    'listing/fetchListingById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/listings/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch listing"
            );
        }
    }
);

// Fetch user's listings
export const fetchUserListings = createAsyncThunk(
    'listings/fetchUserListings',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`${getApiUrl()}/listings/user`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch user listings' });
        }
    }
);

// Create listing
export const createListing = createAsyncThunk(
    'listing/createListing',
    async (listingData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/listings`, listingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create listing"
            );
        }
    }
);

// Update listing
export const updateListing = createAsyncThunk(
    'listing/updateListing',
    async ({ id, listingData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/listings/${id}`,
                listingData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update listing"
            );
        }
    }
);

// Delete listing
export const deleteListing = createAsyncThunk(
    'listing/deleteListing',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/listings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete listing"
            );
        }
    }
);

const initialState = {
    listings: [],
    currentListing: null,
    userListings: [],
    loading: false,
    error: null,
    errorDetails: null,
    success: false
};

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearError: (state) => {
            state.error = null;
            state.errorDetails = null;
        },
        clearCurrentListing: (state) => {
            state.currentListing = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all listings
            .addCase(fetchListings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListings.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload;
                state.error = null;
            })
            .addCase(fetchListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch single listing
            .addCase(fetchListingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListingById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentListing = action.payload;
                state.error = null;
            })
            .addCase(fetchListingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user listings
            .addCase(fetchUserListings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserListings.fulfilled, (state, action) => {
                state.loading = false;
                state.userListings = action.payload;
            })
            .addCase(fetchUserListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user listings';
            })
            // Create listing
            .addCase(createListing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.loading = false;
                state.listings.push(action.payload);
                state.success = true;
                state.error = null;
            })
            .addCase(createListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update listing
            .addCase(updateListing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateListing.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.listings.findIndex(
                    (listing) => listing._id === action.payload._id
                );
                if (index !== -1) {
                    state.listings[index] = action.payload;
                }
                if (state.currentListing?._id === action.payload._id) {
                    state.currentListing = action.payload;
                }
                state.success = true;
                state.error = null;
            })
            .addCase(updateListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete listing
            .addCase(deleteListing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = state.listings.filter(
                    (listing) => listing._id !== action.payload
                );
                if (state.currentListing?._id === action.payload) {
                    state.currentListing = null;
                }
                state.success = true;
                state.error = null;
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { reset, clearError, clearCurrentListing } = listingSlice.actions;
export default listingSlice.reducer; 