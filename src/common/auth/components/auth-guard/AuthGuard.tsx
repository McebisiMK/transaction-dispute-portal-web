import { useEffect, type ReactNode } from 'react';
import { hasAuthParams } from 'react-oidc-context';
import { PageLoader } from '@/common/components/layout';
import { useAuth } from '../../useAuth';
import { UnauthorizedPage } from '@/common/pages/unauthorized-page';

/* ========================================================================================= */

interface AuthGuardProps {
  children:       ReactNode;
  requiredRoles?: string[];
}

const AuthGuard = ({ children, requiredRoles = [] }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, error, login, hasSomeRoles } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !error && !hasAuthParams()) {
      login();
    }
  }, [isAuthenticated, isLoading, error, login]);

  if (error) throw error;

  if (isLoading || !isAuthenticated) {
    return <PageLoader />;
  }

  if (requiredRoles.length > 0 && !hasSomeRoles(requiredRoles)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

/* ========================================================================================= */

export default AuthGuard;
