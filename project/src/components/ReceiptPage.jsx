import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './ReceiptPage.css';

const ReceiptPage = ({ bookingHistory, user, logout }) => {
    const navigate = useNavigate();
    const latestBooking = bookingHistory[bookingHistory.length - 1];

    if (!latestBooking) return null;

    return (
        <div className="receipt-page">
            <Navigation user={user} logout={logout} />

            <div className="receipt-container">
                <div className="receipt-card">
                    <div className="receipt-check-icon">
                        <Check className="check-icon" />
                    </div>

                    <h1 className="receipt-title">Booking Confirmed!</h1>
                    <p className="receipt-subtitle">Your tickets have been booked successfully</p>

                    <div className="receipt-details">
                        <h2 className="details-heading">Booking Receipt</h2>

                        <div className="details-list">
                            <div className="details-item">
                                <span>Booking ID:</span>
                                <span className="font-bold">#{latestBooking.id}</span>
                            </div>
                            <div className="details-item">
                                <span>Movie:</span>
                                <span>{latestBooking.movie.title}</span>
                            </div>
                            <div className="details-item">
                                <span>Showtime:</span>
                                <span>{latestBooking.showtime}</span>
                            </div>
                            <div className="details-item">
                                <span>Seats:</span>
                                <span>{latestBooking.seats.length}</span>
                            </div>
                            <div className="details-item">
                                <span>Booking Date:</span>
                                <span>{latestBooking.bookingDate}</span>
                            </div>
                            <hr />
                            <div className="details-total">
                                <span>Total Paid:</span>
                                <span>${latestBooking.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className="receipt-seats">
                        <h3>Your Seats:</h3>
                        <div className="seats-list">
                            {latestBooking.seats.map(seat => (
                                <span key={seat} className="seat-tag">
                                    {String.fromCharCode(65 + Math.floor((seat - 1) / 10))}{((seat - 1) % 10) + 1}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="receipt-actions">
                        <button
                            onClick={() => navigate('/home')}
                            className="btn-back"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="btn-print"
                        >
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;
