'use client';

import { useState } from 'react';
import { handleFetch } from '../lib/fetch';
import { useRouter, redirect, replace} from 'next/navigation';


interface LoginFormProps {
  onToggleToRegister: () => void;
}

export default function LoginForm({ onToggleToRegister }: LoginFormProps) {
  
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit= async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const result = await handleFetch('login', 'POST', formData);
      result.error ? setError(result.error) : window.location.href = '/pages/calendar'
      
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.log(err)
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Sign in</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="auth-button">
          Sign In
        </button>
      </form>

      <div className="toggle-section">
        <p className="toggle-text">Don't have an account?</p>
        <button 
          type="button" 
          className="toggle-button"
          onClick={onToggleToRegister}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
