const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');
require('dotenv').config();

// Function to read image file and convert to base64
const imageToBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    const extension = path.extname(filePath).toLowerCase().replace('.', '');
    return `data:image/${extension === 'jpg' ? 'jpeg' : extension};base64,${image.toString('base64')}`;
};

// Demo listings data
const demoListings = [
    {
        title: "Luxury Heritage Hotel",
        description: "Experience the perfect blend of traditional architecture and modern luxury in this heritage property. Features spacious rooms, antique furnishings, and a rooftop restaurant with panoramic city views.",
        price: 250,
        location: "Mumbai, Maharashtra",
        type: "hotel",
        maxGuests: 4,
        bedrooms: 2,
        hasBathroom: true,
        amenities: ["WiFi", "Air Conditioning", "Room Service", "Swimming Pool", "Restaurant", "Spa"],
        image: "heritage-block.jpg"
    },
    {
        title: "Modern City Apartment",
        description: "Stylish and contemporary apartment in the heart of the city. Perfect for business travelers or small families. Fully furnished with modern amenities and a stunning view.",
        price: 150,
        location: "Bangalore, Karnataka",
        type: "apartment",
        maxGuests: 3,
        bedrooms: 1,
        hasBathroom: true,
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Washing Machine", "Security"],
        image: "download.jpeg"
    },
    {
        title: "Beachfront Villa",
        description: "Luxurious villa with direct beach access. Enjoy stunning sunset views, private garden, and modern amenities. Perfect for a relaxing beach vacation.",
        price: 350,
        location: "Goa",
        type: "house",
        maxGuests: 6,
        bedrooms: 3,
        hasBathroom: true,
        amenities: ["WiFi", "Air Conditioning", "Private Pool", "Beach Access", "BBQ", "Garden"],
        image: "download (1).jpeg"
    },
    {
        title: "Mountain View Resort",
        description: "Peaceful resort nestled in the mountains. Experience nature at its best with modern comforts. Perfect for weekend getaways and family vacations.",
        price: 200,
        location: "Shimla, Himachal Pradesh",
        type: "hotel",
        maxGuests: 4,
        bedrooms: 2,
        hasBathroom: true,
        amenities: ["WiFi", "Heating", "Restaurant", "Mountain View", "Parking", "Room Service"],
        image: "download (2).jpeg"
    },
    {
        title: "Urban Boutique Hotel",
        description: "Chic boutique hotel in the city's trendy district. Designer interiors, personalized service, and all modern amenities for a comfortable stay.",
        price: 180,
        location: "Delhi",
        type: "hotel",
        maxGuests: 2,
        bedrooms: 1,
        hasBathroom: true,
        amenities: ["WiFi", "Air Conditioning", "Room Service", "Bar", "Restaurant", "Gym"],
        image: "download (3).jpeg"
    }
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayfinder');
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Create a demo host user
const createDemoHost = async () => {
    try {
        const demoHost = await User.findOne({ email: 'demohost@example.com' });
        if (demoHost) {
            return demoHost;
        }

        const newDemoHost = new User({
            name: 'Demo Host',
            email: 'demohost@example.com',
            password: 'demo123456', // In a real app, this should be hashed
            role: 'host'
        });

        await newDemoHost.save();
        console.log('Demo host created successfully');
        return newDemoHost;
    } catch (err) {
        console.error('Error creating demo host:', err);
        throw err;
    }
};

// Seed the database with demo listings
const seedDatabase = async () => {
    try {
        await connectDB();

        // Drop existing collection and indexes
        await mongoose.connection.collection('listings').drop().catch(err => {
            if (err.code !== 26) { // 26 is collection doesn't exist
                throw err;
            }
        });
        console.log('Dropped existing collection');

        // Create demo host
        const demoHost = await createDemoHost();

        // Create new listings with images
        for (const listing of demoListings) {
            try {
                const imagePath = path.join(__dirname, 'images', listing.image);
                const base64Image = imageToBase64(imagePath);

                const newListing = new Listing({
                    ...listing,
                    image: base64Image,
                    host: demoHost._id
                });

                await newListing.save();
                console.log(`Created listing: ${listing.title}`);
            } catch (err) {
                console.error(`Error creating listing ${listing.title}:`, err);
                throw err;
            }
        }

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase(); 