# StayFinder - Property Rental Platform

StayFinder is a full-stack web application similar to Airbnb, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication (Register/Login)
- Property listings with search and filters
- Property details with image gallery
- Booking system
- Responsive design
- Host dashboard for property management

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Maps**: Mapbox

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

5. Open http://localhost:3000 in your browser

## Project Structure

```
stayfinder/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── utils/
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Listings
- GET /api/listings - Get all listings
- GET /api/listings/:id - Get single listing
- POST /api/listings - Create new listing
- PUT /api/listings/:id - Update listing
- DELETE /api/listings/:id - Delete listing

### Bookings
- POST /api/bookings - Create booking
- GET /api/bookings/user - Get user bookings
- GET /api/bookings/listing/:id - Get listing bookings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 

![Screenshot 2025-06-18 234901](https://github.com/user-attachments/assets/f00d6100-8536-440f-b2d6-3f57f9c9d46c)
![Screenshot 2025-06-18 234753](https://github.com/user-attachments/assets/4070aaea-5e88-4a65-bf92-658318e436aa)
![Screenshot 2025-06-18 234839](https://github.com/user-attachments/assets/0fe8548a-e24b-464d-a958-3e2e50635c41)
![Screenshot 2025-06-18 234807](https://github.com/user-attachments/assets/846d3cd4-2e17-47a9-a974-f39d30731d90)



