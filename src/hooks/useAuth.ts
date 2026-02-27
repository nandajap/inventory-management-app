import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Custom hook 
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};