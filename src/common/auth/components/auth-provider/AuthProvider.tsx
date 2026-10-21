import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { AuthContext } from '../../AuthContext';
import type { AuthAccount } from '../../types';
import { useNavigatorOnLine } from '../../../hooks';

/* ========================================================================================= */

const getRealmRoles = (accessToken: string | undefined): string[] => {
  if (!accessToken) return [];
  try {
    const payload = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(payload)) as { realm_access?: { roles?: string[] } };
    return claims.realm_access?.roles ?? [];
  } catch {
    return [];
  }
};

/* ========================================================================================= */

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const oidc     = useOidcAuth();
  const isOnline = useNavigatorOnLine();
  const { user, isAuthenticated, isLoading, error, signinSilent, signinRedirect, signoutRedirect } = oidc;

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  });

  const account = useMemo<AuthAccount | null>(() => {
    if (!user) return null;
    const { sub, name, preferred_username, email } = user.profile;
    return { id: sub, name: name ?? preferred_username ?? '', username: preferred_username ?? '', email: email ?? '' };
  }, [user]);

  const roles = useMemo(() => getRealmRoles(user?.access_token), [user?.access_token]);

  const getTokenSilently = useCallback(async (): Promise<string | undefined> => {
    const current = userRef.current;
    if (!current) return undefined;
    if (!current.expired) return current.access_token;
    const renewed = await signinSilent().catch(() => null);
    return renewed?.access_token;
  }, [signinSilent]);

  const login = useCallback(async () => {
    if (isOnline) {
      await signinRedirect({ redirect_uri: window.location.origin + window.location.pathname }).catch(console.error);
    }
  }, [signinRedirect, isOnline]);

  const logout = useCallback(async () => {
    if (isOnline) {
      await signoutRedirect().catch(console.error);
    }
  }, [signoutRedirect, isOnline]);

  const hasSomeRoles = useCallback((requiredRoles: string[]): boolean => {
    if (requiredRoles.length === 0) return true;
    return roles.some((r) => requiredRoles.includes(r));
  }, [roles]);

  const value = useMemo(() => ({
    account,
    roles,
    isAuthenticated,
    isLoading,
    error,
    getTokenSilently,
    login,
    logout,
    hasSomeRoles,
  }), [account, roles, isAuthenticated, isLoading, error, getTokenSilently, login, logout, hasSomeRoles]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ========================================================================================= */

export default AuthProvider;
