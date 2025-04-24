import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional role requirement for authorization
  redirectTo?: '/login' | '/register' | '/forgot-password'; // Properly typed redirect paths
}

/**
 * A wrapper component that protects routes by checking authentication state
 * and optionally verifying user roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  // Handle authentication and authorization
  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.replace(redirectTo);
      return;
    }

    // If role is required and user doesn't have it, redirect to unauthorized
    if (requiredRole && profile?.role !== requiredRole) {
      router.replace('/unauthorized');
    }
  }, [user, profile, isLoading, requiredRole, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Don't render children until authentication is verified
  if (!user) {
    return null;
  }

  // If role is required and user doesn't have it, don't render
  if (requiredRole && profile?.role !== requiredRole) {
    return null;
  }

  // If authenticated and authorized, render children
  return <>{children}</>;
};
