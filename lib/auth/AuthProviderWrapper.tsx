import React from 'react';
import { AuthProvider } from './AuthContext';

/**
 * A wrapper component that provides authentication context to the entire app
 */
export const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
