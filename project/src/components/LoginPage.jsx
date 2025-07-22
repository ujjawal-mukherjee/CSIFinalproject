import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                    navigate('/home');
                } else {
                    setErrors({ general: data.message || 'Login failed' });
                }
            } catch (error) {
                setErrors({ general: 'Server error' });
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="title">Cineopolis</h1>
                    <h2 className="subtitle">Welcome Back</h2>
                    <p className="description">Sign in to Enjoy Your Movie Journey!</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="login-input-wrapper">
                            <Mail className="login-icon" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="login-input"
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && <p className="login-error">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="login-input-wrapper">
                            <Lock className="login-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="login-input"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="login-toggle"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {errors.password && <p className="login-error">{errors.password}</p>}
                    </div>

                    {errors.general && <p className="login-error">{errors.general}</p>}

                    <button type="submit" className="login-button">Sign In</button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">Sign Up</Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;