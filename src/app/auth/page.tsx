'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useLangSwitcher} from '../hooks/useLangSwitcher';

export default function AuthPage() {
  
  const {switchLanguage} = useLangSwitcher();
  const [isLogin, setIsLogin] = useState(true);
  const locle = useLocale();
  
  const toggleToRegister = () => setIsLogin(false);
  const toggleToLogin = () => setIsLogin(true);

  return ( 
    <div className="auth-container">
    
    <div className="language-container" >
      <Image
        className="language-switcher"
        src="/globe.svg"
        alt="Lang"
        width={24}  
        height={24}
        onClick={switchLanguage}
        loading="eager"
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
