import { createContext } from 'react';
import type { AuthAccount } from './types';

export interface AuthContextValue {
  account:          AuthAccount | null;
  roles:            string[];
  isAuthenticated:  boolean;
  isLoading:        boolean;
  error:            Error | undefined;
  getTokenSilently: () => Promise<string | undefined>;
  login:            () => Promise<void>;
  logout:           () => Promise<void>;
  hasSomeRoles:     (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
