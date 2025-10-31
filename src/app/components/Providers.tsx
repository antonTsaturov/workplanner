//// components/session-provider.tsx
'use client';

//import { createContext, useContext, useEffect, useState } from 'react';
//import NaviBar from './NaviBar';
//import { getSessionInfo } from '../lib/fetch';
import { storage } from '../utils/localStorage';

//interface SessionContextType {
  //session: UserSession | null;
  //isLoading: boolean;
//}

//const SessionContext = createContext<SessionContextType>({
  //session: null,
  //isLoading: true,
//});

//export function SessionProvider({ 
  //children,
//}: { 
  //children: React.ReactNode,
//}) {
  
  //const [session, setSession] = useState();
  ////const [userData, setUserData] = useState(null);
  //async function loadSession() {
    //const session = await getSessionInfo();
    //setSession(session)
//}

  
    
  //useEffect(() => {
    //loadSession()

  //}, []);

  //const resetSession = () => {
    //setSession(null)
  //}
  ////console.log('Providers session: ', session)
  
  //return (
    //<SessionContext.Provider 
      //value={{ session }}
    //>
      //{<NaviBar
        //session={session}
        //resetSession={resetSession}
      ///>}
      //{children}
    //</SessionContext.Provider>
  //);
//}


//export const useSession = () => useContext(SessionContext);

// components/session-provider.tsx
//'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import NaviBar from './NaviBar';
import { getSessionInfo } from '../lib/fetch';

// Типы
interface UserSession {
  id: string;
  email: string;
  name: string;
  // добавьте другие поля по необходимости
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
