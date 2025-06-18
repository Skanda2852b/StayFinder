import React, { useState, useEffect } from 'react';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings');
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">{booking.propertyName}</h2>
                        <p className="text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p className="text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p className="text-gray-600">Status: {booking.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookingsPage; 