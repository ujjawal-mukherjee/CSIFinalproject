import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import { Link } from 'react-router-dom';

const RegisterPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          console.log("user registered");
          setUser(data.user);
          navigate('/home');
        } else {
          setErrors({ general: data.message || 'Registration failed' });
        }
      } catch (error) {
        setErrors({ general: 'Server error' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="title">Cineopolis</h1>
          <h2 className="subtitle">Create Your Movie Account</h2>
          <p className="description">Unlock a World of Cinematic Wonders!</p>
        </div>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="register-input-wrapper">
              <User className="register-icon" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="register-input"
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="register-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="register-input-wrapper">
              <Mail className="register-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="register-input"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="register-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="register-input-wrapper">
              <Phone className="register-icon" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="register-input"
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && <p className="register-error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="register-input-wrapper">
              <Lock className="register-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="register-input"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="register-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="register-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="register-input-wrapper">
              <Shield className="register-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="register-input"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="register-toggle"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="register-error">{errors.confirmPassword}</p>}
          </div>
          {errors.general && <p className="register-error">{errors.general}</p>}
          <button type="submit" className="register-button">Create Account</button>
        </form>
        <div className="register-footer">
          <p>
            Already have an Account?{' '}
            <Link to="/login">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;