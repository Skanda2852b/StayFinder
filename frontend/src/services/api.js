// Remove any MyListings related API calls if they exist:
// export const getMyListings = async () => { ... }
// export const createListing = async () => { ... }
// export const updateListing = async () => { ... }
// export const deleteListing = async () => { ... }

export const getMyBookings = async () => {
    try {
        const response = await axios.get('/api/bookings');
        return response.data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
    }
}; 