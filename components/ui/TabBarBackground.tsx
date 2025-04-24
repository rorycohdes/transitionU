// This file provides a fallback for platforms other than iOS
import { View, StyleSheet } from 'react-native';

// Provide a simple background component for Android and web instead of returning undefined
export default function TabBarBackground() {
  return <View style={StyleSheet.absoluteFill} />;
}

export function useBottomTabOverflow() {
  return 0;
}
