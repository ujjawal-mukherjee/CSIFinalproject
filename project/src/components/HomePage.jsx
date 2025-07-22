import React from 'react';
import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './HomePage.css'; // Import CSS

const HomePage = ({ movies, setSelectedMovie, user, logout }) => {
    const navigate = useNavigate();

    const getGenreColor = (genre) => {
        const colors = {
            Romance: 'genre-romance',
            Thriller: 'genre-thriller',
            'Sci-Fi': 'genre-scifi',
            Comedy: 'genre-comedy',
            Action: 'genre-action'
        };
        return colors[genre] || 'genre-default';
    };

    // Group movies by genre, limit to 3 per genre
    const genres = ['Romance', 'Thriller', 'Sci-Fi', 'Comedy', 'Action'];
    const moviesByGenre = genres.reduce((acc, genre) => {
        acc[genre] = movies.filter(movie => movie.genre === genre).slice(0, 3);
        return acc;
    }, {});

    return (
        <div className="homepage-container">
            <Navigation user={user} logout={logout} />

            <div className="homepage-content">
                <div className="homepage-header">
                    <h1 className="homepage-title">Now Showing</h1>
                    <p className="homepage-subtitle">Discover Amazing Movies & Book Your Seats Today!</p>
                    <div className="header-cta">
                        <button
                            onClick={() => navigate('/')}
                            className="explore-button"
                        >
                            Explore Now
                        </button>
                    </div>
                </div>

                {genres.map((genre) => (
                    moviesByGenre[genre].length > 0 && (
                        <div key={genre} className="genre-row">
                            <h2 className="genre-title">{genre}</h2>
                            <div className="movies-grid">
                                {moviesByGenre[genre].map((movie) => (
                                    <div key={movie.id} className="movie-card">
                                        <div className="movie-image-wrapper">
                                            <img
                                                src={movie.image}
                                                alt={movie.title}
                                                className="movie-image"
                                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                            />
                                            <div className={`movie-genre-badge ${getGenreColor(movie.genre)}`}>
                                                {movie.genre}
                                            </div>
                                            <div className="movie-rating">
                                                <Star className="star-icon" />
                                                <span className="rating-text">{movie.rating}</span>
                                            </div>
                                        </div>
                                        <div className="movie-details">
                                            <h3 className="movie-title">{movie.title}</h3>
                                            <div className="movie-info">
                                                <div className="movie-duration">
                                                    <Clock className="clock-icon" />
                                                    <span>{movie.duration}</span>
                                                </div>
                                                <div className="movie-price">
                                                    <span className="price-text">${movie.price}</span>
                                                </div>
                                            </div>
                                            <p className="movie-description">
                                                {movie.description.substring(0, 100)}...
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSelectedMovie(movie);
                                                    navigate(`/movie/${movie.id}`);
                                                }}
                                                className="details-button"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default HomePage;