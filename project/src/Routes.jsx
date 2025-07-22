import React, { memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import MovieDetailsPage from './components/MovieDetailsPage';
import SeatSelectionPage from './components/SeatSelectionPage';
import CheckoutPage from './components/CheckoutPage';
import ReceiptPage from './components/ReceiptPage';

const AppRoutes = memo(({
    user,
    setUser,
    movies,
    selectedMovie,
    setSelectedMovie,
    selectedSeats,
    setSelectedSeats,
    bookedSeats,
    setBookedSeats,
    bookingHistory,
    setBookingHistory,
    selectedShowtime,
    setSelectedShowtime,
    logout
}) => {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage setUser={setUser} />}
            />
            <Route
                path="/register"
                element={<RegisterPage setUser={setUser} />}
            />
            <Route
                path="/home"
                element={user ? <HomePage movies={movies} setSelectedMovie={setSelectedMovie} user={user} logout={logout} /> : <Navigate to="/login" />}
            />
            <Route
                path="/movie/:id"
                element={user ? (
                    <MovieDetailsPage
                        movies={movies}
                        selectedMovie={selectedMovie}
                        setSelectedMovie={setSelectedMovie}
                        setSelectedShowtime={setSelectedShowtime}
                    />
                ) : (
                    <Navigate to="/login" />
                )}
            />
            <Route
                path="/seat-selection"
                element={user ? (
                    <SeatSelectionPage
                        selectedMovie={selectedMovie}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        selectedShowtime={selectedShowtime}
                        user={user}
                        logout={logout}
                    />
                ) : (
                    <Navigate to="/login" />
                )}
            />
            <Route
                path="/checkout"
                element={
                    <CheckoutPage
                        selectedMovie={selectedMovie}
                        selectedSeats={selectedSeats}
                        selectedShowtime={selectedShowtime}
                        setBookedSeats={setBookedSeats}
                        setBookingHistory={setBookingHistory}
                        user={user}
                        setUser={setUser}
                        logout={logout}
                    />
                }
            />
            <Route
                path="/receipt"
                element={user ? (
                    <ReceiptPage bookingHistory={bookingHistory} />
                ) : (
                    <Navigate to="/login" />
                )}
            />
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
    );
});

export default AppRoutes;