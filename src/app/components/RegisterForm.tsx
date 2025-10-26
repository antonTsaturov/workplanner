'use client';

import { useState } from 'react';
import { handleRegistration } from '../lib/fetch'


interface RegisterFormProps {
  onToggleToLogin: () => void;
}

export default function RegisterForm({ onToggleToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dept: 'CLN',
    //confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    //console.log(formData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password ) { //|| !formData.confirmPassword
      setError('Please fill in all fields');
      return;
    }

    //if (formData.password !== formData.confirmPassword) {
      //setError('Passwords do not match');
      //return;
    //}

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // API call
    try {
      let result = await handleRegistration(formData)
      if (result.error) {
        setError(result.error)
        console.log('handleRegistration result on client: ', result.error)
      } else {
        setSuccess(result.success)
        setTimeout(() => {
          onToggleToLogin();
        }, 2000);        
      } 
      

    } catch (err) {
      console.log('catch err: ', err)
      setError('Registration failed on client side. Please try later.');
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your full name"
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label" unselectable="true">
            Select your department
          </label>
          <select
            //type="password"
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            className="form-input"
            //placeholder="Confirm your password"
            
          >
            <option value="CLN">Clinical</option>
            <option value="DM">Data managment</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="auth-button">
          Create Account
        </button>
      </form>

      <div className="toggle-section">
        <p className="toggle-text">Already have an account?</p>
        <button 
          type="button" 
          className="toggle-button"
          onClick={onToggleToLogin}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
