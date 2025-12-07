'use client';

import { storage } from '../utils/localStorage';
import { createContext, useContext, useEffect, useState } from 'react';
import NaviBar from './NaviBar';
import { handleFetch } from '../lib/fetch';

interface UserSession {
  authenticated: boolean;
  user: {
    userId: string;
    email: string;
    name: string;
    dept: string;
  }
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
      const sessionData = await handleFetch('session', 'GET', null);
      //storage.set('user', sessionData.user)
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
  }

  const refreshSession = async () => {
    await loadSession();
  }

  useEffect(() => {
    loadSession();
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
      <NaviBar
        //session={session}
        resetSession={resetSession}
      />
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
