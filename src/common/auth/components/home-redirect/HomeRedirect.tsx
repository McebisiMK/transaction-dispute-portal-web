import { Navigate } from 'react-router-dom';
import { ROLES } from '@/config-global';
import { useAuth } from '../../useAuth';

/* ========================================================================================= */

const HomeRedirect = () => {
  const { hasSomeRoles } = useAuth();

  return <Navigate to={hasSomeRoles([ROLES.AGENT]) ? '/agent/disputes' : '/transactions'} replace />;
};

/* ========================================================================================= */

export default HomeRedirect;
