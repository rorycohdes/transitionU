import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../lib/auth/AuthContext';

/**
 * Root index component that immediately redirects to the main app tabs
 * Login is temporarily disabled
 */
export default function Index() {
  const { isLoading } = useAuth();
  const router = useRouter();

  // Immediately redirect to tabs
  useEffect(() => {
    if (!isLoading) {
      router.replace('/(tabs)');
    }
  }, [isLoading, router]);

  // Show loading indicator while checking auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
