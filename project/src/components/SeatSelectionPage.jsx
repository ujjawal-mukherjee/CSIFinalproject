import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './SeatSelectionPage.css';

const SeatSelectionPage = ({ selectedMovie, selectedSeats, setSelectedSeats, selectedShowtime, user, logout }) => {
  const navigate = useNavigate();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedMovie?.id || !selectedShowtime) {
      setError('Missing movie or showtime information');
      setLoading(false);
      return;
    }

    // Fetch booked seats from backend
    fetch(`http://localhost:5000/api/auth/check-seat-status?movieId=${selectedMovie.id}&showtime=${selectedShowtime}`, {
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
        console.log('Check-seat-status response:', data);
        if (data.bookedSeats) {
          setBookedSeats(data.bookedSeats);
        } else {
          setError('Failed to fetch booked seats');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching seat status:', err);
        setError('Failed to fetch seat status: ' + err.message);
        setLoading(false);
      });
  }, [selectedMovie, selectedShowtime]);

  if (!selectedMovie) {
    return <div className="seat-page">No movie selected</div>;
  }

  if (loading) {
    return <div className="seat-page">Loading seats...</div>;
  }

  if (error) {
    return <div className="seat-page">{error}</div>;
  }

  const totalSeats = 100;
  const seatsPerRow = 10;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  const getSeatNumber = (row, seat) => row * seatsPerRow + seat + 1;

  const isSeatBooked = (seatNumber) => bookedSeats.includes(seatNumber);

  const isSeatSelected = (seatNumber) => selectedSeats.includes(seatNumber);

  const handleSeatClick = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return;

    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const totalPrice = selectedSeats.length * selectedMovie.price;

  return (
    <div className="seat-page">
      <Navigation user={user} logout={logout} />

      <div className="seat-content">
        <button
          onClick={() => navigate('/movie/' + selectedMovie.id)}
          className="back-btn"
        >
          <ArrowLeft className="back-icon" />
          <span>Back to Movie Details</span>
        </button>

        <div className="seat-card">
          <div className="seat-header">
            <h1 className="seat-title">Select Your Seats</h1>
            <p className="seat-subtitle">{selectedMovie.title} - {selectedShowtime}</p>
          </div>

          <div className="screen">SCREEN</div>

          <div className="seat-grid">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div key={rowIndex} className="seat-row">
                <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatNumber = getSeatNumber(rowIndex, seatIndex);
                  if (seatNumber > totalSeats) return null;

                  const seatClass = isSeatBooked(seatNumber)
                    ? 'seat booked'
                    : isSeatSelected(seatNumber)
                      ? 'seat selected'
                      : 'seat available';

                  return (
                    <button
                      key={seatIndex}
                      onClick={() => handleSeatClick(seatNumber)}
                      className={seatClass}
                      disabled={isSeatBooked(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item"><div className="legend-box available"></div> Available</div>
            <div className="legend-item"><div className="legend-box selected"></div> Selected</div>
            <div className="legend-item"><div className="legend-box booked"></div> Booked</div>
          </div>

          <div className="summary">
            <div className="summary-info">
              <div>
                <h3>Booking Summary</h3>
                <p>Selected Seats: {selectedSeats.length}</p>
              </div>
              <div className="summary-price">
                <p className="total-price">${totalPrice}</p>
                <p className="per-seat">${selectedMovie.price} per seat</p>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="selected-list">
                <p>Selected Seats:</p>
                <div className="selected-seats">
                  {selectedSeats.map(seat => (
                    <span key={seat} className="seat-tag">
                      {String.fromCharCode(65 + Math.floor((seat - 1) / seatsPerRow))}
                      {((seat - 1) % seatsPerRow) + 1}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              disabled={selectedSeats.length === 0}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;