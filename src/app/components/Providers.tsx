'use client';

import { storage } from '../utils/localStorage';
import { createContext, useContext, useEffect, useState } from 'react';
import NaviBar from './NaviBar';
import { getSessionInfo } from '../lib/fetch';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Типы
interface UserSession {
  id: string;
  email: string;
  name: string;
  dept: string;
}

interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  resetSession: () => void;
  refreshSession: () => Promise<void>;
}

// Создание контекста с default values
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ 
  children,
}: { 
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadSession() {
    try {
      setIsLoading(true);
      const sessionData = await getSessionInfo();
      storage.set('user', sessionData.user)
      //console.log('sessionData.user: ', sessionData.user)
      setSession(sessionData);
    } catch (error) {
      console.error('Failed to load session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }

  const resetSession = () => {
    setSession(null);
    // Дополнительно можно очистить localStorage/cookies
  }

  const refreshSession = async () => {
    await loadSession();
  }

  useEffect(() => {
    // Проверяем есть ли сохраненная сессия в localStorage
    //const savedSession = storage.get('user');
    //if (savedSession) {
      //setSession(savedSession);
      //setIsLoading(false);
    //} else {
      loadSession();
    //}
  }, []);
  // Значение контекста
  const contextValue: SessionContextType = {
    session,
    isLoading,
    resetSession,
    refreshSession,
  };
  
  //console.log(session)
  return (
    <SessionContext.Provider value={contextValue}>
      <Router>
      <NaviBar
        //session={session}
        resetSession={resetSession}
      />
      </Router>
      {children}
    </SessionContext.Provider>
  );
}

// Хук для использования сессии
export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}
