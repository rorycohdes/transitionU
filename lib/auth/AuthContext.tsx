import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import { UserModel } from '../models/user';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

// Ensure web browser auth redirects work properly
WebBrowser.maybeCompleteAuthSession();

// Define the shape of our auth context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null; // Full user profile from our database
  isLoading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  skipLogin: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  skipLogin: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap our app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSkippedLogin, setIsSkippedLogin] = useState<boolean>(false);

  // Create guest user function
  const createGuestUser = () => {
    // Create a mock user for guest access
    const mockUser = {
      id: 'guest-user',
      email: 'guest@example.com',
      user_metadata: {
        is_guest: true,
        full_name: 'Guest User',
      },
    };

    // Create a mock profile
    const mockProfile = {
      id: 'guest-profile',
      auth_id: 'guest-user',
      email: 'guest@example.com',
      first_name: 'Guest',
      last_name: 'User',
    };

    // Set user and profile with mock data
    setUser(mockUser as any);
    setProfile(mockProfile);
    setIsSkippedLogin(true);
    setIsLoading(false);
  };

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleWebClientId,
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
    redirectUri: Constants.expoConfig?.extra?.redirectUri,
    responseType: 'id_token',
    scopes: ['profile', 'email'],
  });

  // Handle Google auth response
  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { accessToken } = response.authentication;
      handleGoogleToken(accessToken);
    }
  }, [response]);

  // Handle Google access token
  const handleGoogleToken = async (token: string) => {
    try {
      // Sign in with Supabase using the Google token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
      });

      if (error) throw error;

      // If this is a new user, create a profile in our database
      if (data?.user && data.user.app_metadata.provider === 'google') {
        const existingProfile = await UserModel.getByAuthId(data.user.id);

        if (!existingProfile) {
          // Extract name from user metadata
          const firstName = data.user.user_metadata.full_name?.split(' ')[0] || '';
          const lastName = data.user.user_metadata.full_name?.split(' ').slice(1).join(' ') || '';

          await UserModel.create(data.user.id, data.user.email as string, firstName, lastName, {
            institution: '',
            major: '',
            visaType: undefined,
            homeCountry: '',
            avatarUrl: data.user.user_metadata.avatar_url,
          });
        }
      }
    } catch (error) {
      console.error('Error handling Google token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    // TEMPORARY: Use guest user instead of actual authentication
    createGuestUser();
    return;

    /* AUTHENTICATION CODE COMMENTED OUT FOR NOW
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile from our database
        const userProfile = await UserModel.getByAuthId(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    // Initial session check
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profile from our database
        const userProfile = await UserModel.getByAuthId(session.user.id);
        setProfile(userProfile);
      }

      setIsLoading(false);
    };

    checkSession();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
    */
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      // Create user profile in our database
      await UserModel.create(data.user.id, email, userData.firstName, userData.lastName, {
        institution: userData.institution,
        major: userData.major,
        visaType: userData.visaType,
        homeCountry: userData.homeCountry,
      });
    }

    setIsLoading(false);
    return { error: null };
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    return { error };
  };

  // Sign in with Google function
  const signInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await promptAsync();
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'transitionu://reset-password',
    });

    setIsLoading(false);
    return { error };
  };

  // Update password function
  const updatePassword = async (password: string) => {
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setIsLoading(false);
    return { error };
  };

  // Skip login function - creates a guest session
  const skipLogin = () => {
    createGuestUser();
  };

  // Value to be provided to consumers
  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    skipLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
