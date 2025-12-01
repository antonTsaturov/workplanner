'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useLangSwitcher} from '../hooks/useLangSwitcher';
import { useLocale } from 'next-intl';



export default function AuthPage() {
  
  const {switchLanguage} = useLangSwitcher();
  
  const locle = useLocale();
  
  const [isLogin, setIsLogin] = useState(true);

  const toggleToRegister = () => setIsLogin(false);
  const toggleToLogin = () => setIsLogin(true);

  return ( 
    <div className="auth-container">
    
    <div className="language-container" >
      <img
        className="language-switcher"
        src="/globe.svg"
        alt="Lang"
        style={{heigth:24, width:24}}
        onClick={switchLanguage}
      />
      <span className="language-tooltip">{locle.toUpperCase()}</span>
    </div>
      
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
