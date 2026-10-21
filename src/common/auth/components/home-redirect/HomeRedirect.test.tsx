import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ROLES } from '@/config-global';
import { AuthContext, type AuthContextValue } from '../../AuthContext';
import HomeRedirect from './HomeRedirect';

/* ========================================================================================= */

const renderAs = (roles: string[]) => {
  const auth = { roles, hasSomeRoles: (required: string[]) => roles.some((role) => required.includes(role)) } as AuthContextValue;
  const router = createMemoryRouter([{ path: '/', element: <HomeRedirect /> }, { path: '*', element: null }]);

  render(
    <AuthContext.Provider value={auth}>
      <RouterProvider router={router} />
    </AuthContext.Provider>,
  );

  return router;
};

describe('HomeRedirect', () => {
  it('sends customers to their transactions', () => {
    expect(renderAs([ROLES.CUSTOMER]).state.location.pathname).toBe('/transactions');
  });

  it('sends agents to the dispute queue', () => {
    expect(renderAs([ROLES.AGENT]).state.location.pathname).toBe('/agent/disputes');
  });
});
