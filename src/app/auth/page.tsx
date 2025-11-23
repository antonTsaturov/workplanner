'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleToRegister = () => setIsLogin(false);
  const toggleToLogin = () => setIsLogin(true);

  return (
    <div className="auth-container">
      <div className={`auth-transition ${isLogin ? 'login-active' : 'register-active'}`}>
        {isLogin ? (
          <LoginForm onToggleToRegister={toggleToRegister} />
        ) : (
          <RegisterForm onToggleToLogin={toggleToLogin} />
        )}
      </div>
    </div>
  );
}
