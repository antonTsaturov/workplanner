// hooks/use-session.ts
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessionPayload } from '../lib/session';

interface SessionContextType {
  session: SessionPayload | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/user/session');
        const SessionPayload = await response.json();
        setSession(SessionPayload);
      } catch (error) {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  console.log('SessionProvider: ', session)
  
  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
