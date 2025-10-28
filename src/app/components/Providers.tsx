// components/session-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import NaviBar from './NaviBar';
import { getSessionInfo } from '../lib/fetch';
import { useRouter } from 'next/navigation';


interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
});

export function SessionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
   useEffect(() => {
    //async function loadSession() {
      //try {
        //const response = await fetch('/api/user/session');
        //if (response.ok) {
          
          //const userSession = await response.json()
          //console.log('SessionProvider : ', userSession)
          //setSession(userSession);
        //} else {
          //setSession(null);
        //}
      //} catch (error) {
        //console.error('Failed to load session:', error);
        //setSession(null);
      //} finally {
        //setIsLoading(false);
      //}
    //}

    //loadSession();
     async function loadSession() {
       const session = await getSessionInfo();
       console.log('SessionProvider : ', session)
       if (session.authenticated === false) {
         router.push('/auth');
       }
       setSession(session)
     }
     loadSession()

   }, []);

  
  
  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {session &&
        <NaviBar 
        userData={session.session}
      />}
        {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
