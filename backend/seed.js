const mongoose = require('mongoose');
const Listings = require('./models/Listing');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB first
mongoose.connect('mongodb://localhost:27017/stayease')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    });

// Function to convert image to base64
const imageToBase64 = (imagePath) => {
    const imageBuffer = fs.readFileSync(path.join(__dirname, 'images', imagePath));
    return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
};

const listings = [
    {
        title: 'Heritage Block Hotel',
        description: 'Experience luxury in our heritage block hotel with modern amenities',
        price: 250,
        location: 'Mumbai, Maharashtra',
        image: imageToBase64('heritage-block.jpg'),
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
        maxGuests: 4,
        bedrooms: 2,
        hasBathroom: true,
        type: 'hotel',
        host: '685258eeba8ae1fa60afefd0'
    },
    {
        title: 'Modern City View Apartment',
        description: 'Stunning city views from this modern apartment',
        price: 180,
        location: 'Delhi, India',
        image: imageToBase64('download.jpeg'),
        amenities: ['WiFi', 'Kitchen', 'Balcony', 'Parking'],
        maxGuests: 3,
        bedrooms: 2,
        hasBathroom: true,
        type: 'hotel',
        host: '685258eeba8ae1fa60afefd0'
    },
    {
        title: 'Luxury Beach Resort',
        description: 'Beautiful beachfront property with ocean views',
        price: 300,
        location: 'Goa, India',
        image: imageToBase64('download (1).jpeg'),
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Spa'],
        maxGuests: 4,
        bedrooms: 2,
        hasBathroom: true,
        type: 'hotel',
        host: '685258eeba8ae1fa60afefd0'
    },
    {
        title: 'Mountain View Cabin',
        description: 'Cozy cabin with breathtaking mountain views',
        price: 150,
        location: 'Manali, India',
        image: imageToBase64('download (2).jpeg'),
        amenities: ['WiFi', 'Fireplace', 'Kitchen'],
        maxGuests: 4,
        bedrooms: 2,
        hasBathroom: true,
        type: 'hotel',
        host: '685258eeba8ae1fa60afefd0'
    },
    {
        title: 'Urban Loft Apartment',
        description: 'Stylish loft in the heart of the city',
        price: 200,
        location: 'Bangalore, India',
        image: imageToBase64('download (3).jpeg'),
        amenities: ['WiFi', 'Gym', 'Parking', 'Security'],
        maxGuests: 2,
        bedrooms: 1,
        hasBathroom: true,
        type: 'hotel',
        host: '685258eeba8ae1fa60afefd0'
    }
];

const seedListings = async () => {
    try {
        const createdListings = await Listings.create(listings);
        console.log('New listings created:', createdListings.length);
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Wait for connection before seeding
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected, starting seed...');
    seedListings();
});

// Read the images directory
const imagesDir = path.join(__dirname, 'images');
const imageFiles = fs.readdirSync(imagesDir);

console.log('Available images:', imageFiles); 