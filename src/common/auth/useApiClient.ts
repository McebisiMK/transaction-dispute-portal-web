import { useContext } from 'react';
import { ApiClientContext } from './ApiClientContext';

export const useApiClient = () => {
  const context = useContext(ApiClientContext);

  if (!context) throw new Error('useApiClient must be used inside ApiClientProvider');

  return context;
};
