
import type { Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export const SessionContext = createContext<Session | null>(null);
export const useSession = () => useContext(SessionContext);
