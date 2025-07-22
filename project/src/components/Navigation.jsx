import React, { useEffect } from 'react';
import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ user, setUser = () => { }, logout = () => { } }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/check-login', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok && data.user) {
                    setUser(data.user); // Safe call with default empty function
                } else {
                    setUser(null);
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setUser(null); // Safe call
                navigate('/login');
            }
        };
        checkLoginStatus();
    }, [setUser, navigate]);

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="nav-bar">
            <div className="nav-container">
                <div className="nav-left">
                    <h1 className="nav-title">Cineopolis</h1>
                    <button
                        onClick={() => navigate('/home')}
                        className="nav-button"
                    >
                        <Home className="nav-icon" />
                        <span>Home</span>
                    </button>
                </div>
                <div className="nav-right">
                    <span className="nav-welcome">Welcome, {user.name}!</span>
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        <LogOut className="nav-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;