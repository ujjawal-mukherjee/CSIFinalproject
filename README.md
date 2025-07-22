Cineopolis Ticket Booking Application
Cineopolis is a modern, full-stack web application for booking movie tickets online. Users can browse movies, select showtimes, choose seats, make secure payments via Stripe, and view booking confirmations. The application features a responsive frontend built with React and a robust backend powered by Node.js, Express, and MongoDB, with session-based authentication and real-time seat availability.
Table of Contents

Features
Demo
Technologies Used
Installation
Usage
Project Structure
API Endpoints
Contributing
License

Features

User Authentication: Secure signup and login with session management.
Movie Selection: Browse a curated list of movies across genres like Romance, Thriller, Sci-Fi, Comedy, and Action.
Showtime Selection: Choose from multiple showtimes for each movie.
Seat Selection: Interactive seat map with real-time availability (booked seats in red, available in green).
Secure Payments: Process payments securely using Stripe's payment intent API.
Booking Confirmation: View booking details and history after successful payment.
Responsive Design: Optimized for both desktop and mobile devices.
Real-Time Data: Fetches booked seats from MongoDB to ensure accurate seat availability.

Demo
Explore the application through the following screenshots:
Login Page
![cin1](https://github.com/user-attachments/assets/6f1e1db4-95f1-43d5-8487-94b0dc6aff6d)

Register Page
![cin2](https://github.com/user-attachments/assets/984de6c7-e845-4de4-9d7e-454d15672f25)

Home Page
![cin3](https://github.com/user-attachments/assets/a07a0232-92c1-44b6-a884-8b7f65d6db3c)

Movie Details and Showtime Selection
![cin4](https://github.com/user-attachments/assets/aa01159e-2917-4bd6-b340-87a9e933c191)

Seat Selection
![cin5](https://github.com/user-attachments/assets/6340d7c2-3acb-4f77-aaaa-12d616736f8c)

Payment
![cin6](https://github.com/user-attachments/assets/aff7f586-3321-46e9-aab5-74eeb1c7da3f)

Booking Confirmation
![cin7](https://github.com/user-attachments/assets/d7c9a95a-ed85-4669-81aa-e8705bf858b0)

Technologies Used
Frontend

React: JavaScript library for building user interfaces.
React Router: For client-side routing.
Stripe (React-Stripe-JS): For secure payment processing.
Lucide-React: For icons (e.g., ArrowLeft, Home, LogOut).
CSS: Custom styles for responsive design.
Vite: Build tool for fast development and production builds.

Backend

Node.js: JavaScript runtime for server-side logic.
Express: Web framework for building RESTful APIs.
MongoDB: NoSQL database for storing users and bookings.
Mongoose: ODM for MongoDB data modeling.
Express-Session: For session-based authentication.
Connect-Mongo: MongoDB session store.
Bcrypt: For password hashing.
Stripe: For payment processing.
CORS: For enabling cross-origin requests.

Database

MongoDB: Stores user data (users collection) and booking data (bookings collection).

Installation
Follow these steps to set up the project locally.
Prerequisites

Node.js (v16 or higher)
MongoDB (running locally or via MongoDB Atlas)
Stripe Account (for test API keys)

Steps

Clone the Repository:
git clone https://github.com/your-username/cinemax-ticket-booking.git
cd cinemax-ticket-booking


Backend Setup:

Navigate to the backend directory (if separate, or root if combined):cd backend


Install dependencies:npm install




Start MongoDB locally or update the MongoDB URI in app.js if using Atlas:MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/ticket_booking' })


Start the backend server:npm start

The server runs on http://localhost:5000.


Frontend Setup:

Navigate to the frontend directory (if separate, or root if combined):cd frontend


Install dependencies:npm install


Start the frontend development server:npm run dev

The app runs on http://localhost:5173.


MongoDB Setup:

Ensure MongoDB is running on mongodb://localhost:27017/ticket_booking.
Verify the users and bookings collections are created automatically when users register and bookings are made.



Usage

Register/Login:

Visit http://localhost:5173/login or /signup to create an account or log in.
Use a valid email (e.g., test@gmail.com) and password (minimum 6 characters).


Browse Movies:

On the home page (/home), browse movies by genre or select a movie to view details.
Choose a showtime (e.g., "10:30 AM" for "Love in Bloom").


Select Seats:

On the seat selection page (/seat-selection), view available seats (greenish-gray) and booked seats (red).
Click to select/deselect seats (selected seats turn green).
Example: Seat 6 for "Love in Bloom" at "10:30 AM" should be red and disabled.


Make Payment:



Confirm payment to save the booking to MongoDB.


View Confirmation:

After payment, view booking details on the /receipt page, including movie title, seats, showtime, and total price.
