import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navigation from './Navigation';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_');

const CheckoutForm = ({ selectedMovie, selectedSeats, selectedShowtime, setBookedSeats, setBookingHistory, user, setUser = () => { } }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const totalPrice = selectedSeats.length * selectedMovie.price;

    useEffect(() => {
        console.log('CheckoutForm User object:', user);
        console.log('CheckoutForm User email:', user?.email);
        console.log('CheckoutForm setUser type:', typeof setUser);

        // Fetch user session if user.email is missing
        if (!user?.email) {
            fetch('http://localhost:5000/api/auth/check-login', {
                method: 'GET',
                credentials: 'include',
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Check-login response in CheckoutForm:', data);
                    if (data.user && typeof setUser === 'function') {
                        setUser(data.user);
                    } else if (!data.user) {
                        setError('User not authenticated. Please log in.');
                        navigate('/login');
                    } else {
                        console.warn('setUser is not a function, skipping state update');
                        setError('Authentication error: Unable to update user state');
                        navigate('/login');
                    }
                })
                .catch(err => {
                    console.error('Check-login error:', err);
                    setError('Failed to verify user session: ' + err.message);
                    navigate('/login');
                });
            return;
        }

        if (!selectedMovie?.id || !selectedMovie?.title || !selectedSeats?.length || !selectedShowtime) {
            setError('Missing required booking information');
            return;
        }

        fetch("http://localhost:5000/api/auth/create-payment-intent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                amount: totalPrice * 100,
                currency: 'usd',
                userEmail: user.email,
                metadata: {
                    movieId: selectedMovie.id,
                    movieTitle: selectedMovie.title,
                    seats: selectedSeats.join(','),
                    showtime: selectedShowtime,
                },
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log('Payment intent response:', data);
                if (data.error) {
                    setError(data.error);
                } else if (!data.clientSecret) {
                    setError('No client secret received from server');
                } else {
                    setClientSecret(data.clientSecret);
                    console.log('Client secret set:', data.clientSecret);
                }
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError('Failed to create payment intent: ' + err.message);
            });
    }, [selectedMovie, selectedSeats, selectedShowtime, totalPrice, user, navigate, setUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        if (!stripe || !elements || !clientSecret) {
            setError('Payment initialization failed. Please try again.');
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: user?.name || 'Guest',
                    email: user?.email || '',
                },
            },
        });

        if (error) {
            console.error('Payment error:', error);
            setError(error.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            setBookedSeats(prev => ({
                ...prev,
                [selectedMovie.id]: new Set([...(prev[selectedMovie.id] || []), ...selectedSeats])
            }));

            const booking = {
                id: Date.now(),
                movie: selectedMovie,
                seats: selectedSeats,
                showtime: selectedShowtime,
                totalPrice,
                bookingDate: new Date().toLocaleDateString(),
                paymentIntentId: paymentIntent.id,
            };

            setBookingHistory(prev => [...prev, booking]);
            navigate('/receipt');
        }
        setProcessing(false);
    };

    return (
        <div className="payment-form">
            <h2>Payment Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card Details</label>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                    {error && <p className="error-text">{error}</p>}
                </div>
                <button
                    type="submit"
                    className="pay-btn"
                    disabled={!stripe || !clientSecret || processing}
                >
                    {processing ? 'Processing...' : `Complete Payment - $${totalPrice}`}
                </button>
            </form>
        </div>
    );
};

const CheckoutPage = ({ selectedMovie, selectedSeats, selectedShowtime, setBookedSeats, setBookingHistory, user, setUser = () => { }, logout }) => {
    const navigate = useNavigate();
    const totalPrice = selectedSeats.length * selectedMovie.price;

    useEffect(() => {
        console.log('CheckoutPage User object:', user);
        console.log('CheckoutPage setUser type:', typeof setUser);
        if (!user?.email) {
            console.log('No user email, redirecting to login');
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className="checkout-page">
            <Navigation user={user} setUser={setUser} logout={logout} />
            <div className="checkout-content">
                <button
                    onClick={() => navigate('/seat-selection')}
                    className="back-btn"
                >
                    <ArrowLeft className="back-icon" />
                    <span>Back to Seat Selection</span>
                </button>

                <div className="checkout-grid">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Movie:</span>
                                <span>{selectedMovie.title}</span>
                            </div>
                            <div className="summary-item">
                                <span>Showtime:</span>
                                <span>{selectedShowtime}</span>
                            </div>
                            <div className="summary-item">
                                <span>Seats:</span>
                                <span>{selectedSeats.length}</span>
                            </div>
                            <div className="summary-item">
                                <span>Price per seat:</span>
                                <span>${selectedMovie.price}</span>
                            </div>
                            <hr />
                            <div className="summary-total">
                                <span>Total:</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                        <div className="selected-seats-box">
                            <h3>Selected Seats:</h3>
                            <div className="seat-tags">
                                {selectedSeats.map(seat => (
                                    <span key={seat} className="seat-tag">
                                        {String.fromCharCode(65 + Math.floor((seat - 1) / 10))}
                                        {((seat - 1) % 10) + 1}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm
                            selectedMovie={selectedMovie}
                            selectedSeats={selectedSeats}
                            selectedShowtime={selectedShowtime}
                            setBookedSeats={setBookedSeats}
                            setBookingHistory={setBookingHistory}
                            user={user}
                            setUser={setUser}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;