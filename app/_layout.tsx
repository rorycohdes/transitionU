import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Stack, useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AuthProviderWrapper } from '../lib/auth/AuthProviderWrapper';
import { useAuth } from '../lib/auth/AuthContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Auth session management component
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Monitor auth state and route accordingly
  useEffect(() => {
    if (isLoading) return;

    // TEMPORARY: Always redirect to main app, bypassing login screens
    if (
      segments[0] === 'login' ||
      segments[0] === 'register' ||
      segments[0] === 'forgot-password' ||
      segments[0] === 'reset-password'
    ) {
      router.replace('/(tabs)');
    }

    /* ORIGINAL AUTHENTICATION LOGIC - COMMENTED OUT TEMPORARILY
    // Check if current route is an auth route (login, register, etc.)
    const inAuthGroup =
      segments[0] === 'login' ||
      segments[0] === 'register' ||
      segments[0] === 'forgot-password' ||
      segments[0] === 'reset-password';

    if (!user && !inAuthGroup) {
      // If not logged in and not on auth page, redirect to login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // If logged in and on auth page, redirect to app
      router.replace('/(tabs)');
    }
    */
  }, [user, segments, isLoading]);

  // Display children regardless, router will handle redirects
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProviderWrapper>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthWrapper>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" options={{ headerShown: true, title: 'Sign Up' }} />
              <Stack.Screen
                name="forgot-password"
                options={{ headerShown: true, title: 'Forgot Password' }}
              />
              <Stack.Screen
                name="reset-password"
                options={{ headerShown: true, title: 'Reset Password' }}
              />
              <Stack.Screen name="unauthorized" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AuthWrapper>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProviderWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
