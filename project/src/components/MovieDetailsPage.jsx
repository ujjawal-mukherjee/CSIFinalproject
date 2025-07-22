import React, { useEffect } from 'react';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from './Navigation';
import './MovieDetailsPage.css'; // import CSS

const MovieDetailsPage = ({ movies, selectedMovie, setSelectedMovie, setSelectedShowtime, user, logout }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const movie = movies.find(m => m.id === parseInt(id));
        setSelectedMovie(movie);
    }, [id, movies, setSelectedMovie]);

    if (!selectedMovie) return null;

    const handleBooking = (showtime) => {
        setSelectedShowtime(showtime);
        navigate('/seat-selection');
    };

    return (
        <div className="details-container">
            <Navigation user={user} logout={logout} />

            <div className="details-content">
                <button
                    onClick={() => navigate('/home')}
                    className="back-button"
                >
                    <ArrowLeft className="back-icon" />
                    <span>Back to Movies</span>
                </button>

                <div className="details-card">
                    <div className="details-flex">
                        <div className="details-image-wrapper">
                            <img
                                src={selectedMovie.image}
                                alt={selectedMovie.title}
                                className="details-image"
                            />
                        </div>

                        <div className="details-info">
                            <div className="details-header">
                                <h1 className="details-title">{selectedMovie.title}</h1>
                                <span className="genre-badge">{selectedMovie.genre}</span>
                            </div>

                            <div className="details-meta">
                                <div className="meta-item">
                                    <Star className="star-icon" />
                                    <span className="meta-text">{selectedMovie.rating}/5</span>
                                </div>
                                <div className="meta-item">
                                    <Clock className="clock-icon" />
                                    <span>{selectedMovie.duration}</span>
                                </div>
                                <div className="meta-item price-text">
                                    ${selectedMovie.price}
                                </div>
                            </div>

                            <div className="details-section">
                                <h3 className="section-title">Description</h3>
                                <p className="section-text">{selectedMovie.description}</p>
                            </div>

                            <div className="details-section">
                                <h3 className="section-title">Director</h3>
                                <p className="section-text">{selectedMovie.director}</p>
                            </div>

                            <div className="details-section">
                                <h3 className="section-title">Cast</h3>
                                <div className="cast-list">
                                    {selectedMovie.cast.map((actor, index) => (
                                        <span key={index} className="cast-item">{actor}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="details-section">
                                <h3 className="section-title">Showtimes</h3>
                                <div className="showtimes-grid">
                                    {selectedMovie.showtimes.map((time, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleBooking(time)}
                                            className="showtime-button"
                                        >
                                            <Calendar className="calendar-icon" />
                                            <span>{time}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;
