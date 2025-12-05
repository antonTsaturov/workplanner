'use client';

import { useState } from 'react';
import { handleFetch } from '../lib/fetch';
import { weakPasswordPatterns } from '../utils/passcheck';
import { useTranslations } from 'next-intl';

interface RegisterFormProps {
  onToggleToLogin: () => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
}


const EMAIL_RGX = /^(?:(?!\.)[a-zA-Z0-9._%+-]+(?<!\.))@(?:(?!-)[a-zA-Z0-9-]+(?<!-)\.)+(?:[a-zA-Z]{2,}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/



export default function RegisterForm({ onToggleToLogin }: RegisterFormProps) {
  
  const t = useTranslations('registerForm');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dept: 'CLN',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return ' is required.';
        if (value.trim().length < 4) return ' must be at least 4 characters length.';
        if (!/^[a-zA-Zа-яА-Яё\s\-']+$/.test(value.trim())) return ' must contain only letters.';
        return '';
      
      case 'email':
        if (!value.trim()) return ' is required.';
        if (!EMAIL_RGX.test(value)) return ' not valid.';
        return '';
        
      case 'password':
        if (!value.trim()) return ' is required.';
        if (value.trim().length < 6) return ' must be at least 6 characters long.';
        if (weakPasswordPatterns.keyboardPatterns.test(value.trim())) return ' not must be a common pattern.';
        return '';
              
      default:
        return '';
    }
  };

  type FormElement = HTMLInputElement | HTMLSelectElement;

  const handleChange = (e: React.ChangeEvent<FormElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    //console.log(formData)

    // Validate field immediately after change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
    
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
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password ) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // API call
    try {
      const result = await handleFetch('register', 'POST', formData)
      if (result.error) {
        setError(result.error)
        console.log('RegisterForm error: ', result.error)
        
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
      <h1 className="auth-title">{t('authTitle')}</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            {t('name')}
            <span className="error-message">
              {errors.name && touched.name ? errors.name : null}
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder={t('namePlaceholder')}
            onBlur={handleBlur}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            {t('email')}
            <span className="error-message">
              {errors.email && touched.email ? errors.email : null}
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder={t('emailPlaceholder')}
            onBlur={handleBlur}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            {t('password')}
            <span className="error-message">
              {errors.password && touched.password ? errors.password : null}
            </span>            
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder={t('passwordPlaceholder')}
            onBlur={handleBlur}
          />
        </div>

        <div className="form-group">
          <label htmlFor="department" className="form-label" unselectable="on">
            {t('departmentSelect')}
          </label>
          <select
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            className="form-input select"
          >
            <option value="CLN">{t('clinical')}</option>
            <option value="DM">{t('dataManagement')}</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="auth-button">
          {t('authButtonTitle')}
        </button>
      </form>

      <div className="toggle-section">
        <p className="toggle-text">{t('toggleText')}</p>
        <button 
          type="button" 
          className="toggle-button"
          onClick={onToggleToLogin}
        >
          {t('toggleButtonText')}
        </button>
      </div>
    </div>
  );
}
