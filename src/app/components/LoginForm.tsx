'use client';

import { useState } from 'react';
import { handleFetch } from '../lib/fetch';
import { useTranslations } from 'next-intl';


interface LoginFormProps {
  onToggleToRegister: () => void;
}

export default function LoginForm({ onToggleToRegister }: LoginFormProps) {
  
  const t = useTranslations('loginForm');

    
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  const validateField = (name: string, value: string): string => {
    const containNumberRegex = /[0-9]/g;
    switch (name) {
      case 'email':
        if (!value.trim()) return ' is required';
        if (!/^[a-zA-Z._0-9^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return ' format is not valid ';
        return '';
        
      case 'password':
        if (!value.trim()) return ' is required';
        return '';
            
      default:
        return '';
    }
  };

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    console.log('hello')
  };
  
  const getInputClassName = (fieldName: string): string => {
    const baseClass = fieldName === 'status' ? 'form-select' : 'form-input';
    if (errors[fieldName as keyof FormErrors] && touched[fieldName]) {
      return `${baseClass} input-error`;
    }
    return baseClass;
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
    
      <img src="/assets/workplanner_logo.png" alt="Workplanner Logo" style={{scale: '0.8'}} />
      <h1 className="auth-title">{t('authTitle')}</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {t('email')}
            <label className="error-message">
              {errors.email && touched.email ? errors.email : null}
            </label>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('email')}
            placeholder={t('emailPlaceholder')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
            <label className="error-message">
              {errors.password && touched.password ? errors.password : null}
            </label >
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('password')}
            placeholder={t('passwordPlaceholder')}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="auth-button">
          {t('authButtonTitle')}
        </button>
      </form>

      <div className="toggle-section">
        <p className="toggle-text">{t('toggleText')}</p>
        <button 
          type="button" 
          className="toggle-button"
          onClick={onToggleToRegister}
        >
          {t('toggleButtonText')}
        </button>
      </div>
    </div>
  );
}
