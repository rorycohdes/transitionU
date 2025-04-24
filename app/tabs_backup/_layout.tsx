import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// Authentication check temporarily disabled
// import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // ProtectedRoute wrapper temporarily removed to disable authentication
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: 'Roadmap',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.wave.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />

      {/* Screen hidden from the tab bar */}
      <Tabs.Screen
        name="dm" // Corresponds to app/(tabs)/dm.tsx
        options={{
          href: null, // This removes the tab from navigation
        }}
      />

      {/* Hide other screens from the tab bar */}
      <Tabs.Screen
        name="checklist"
        options={{
          href: null, // This removes the tab from navigation
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // This removes the tab from navigation
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          href: null, // This removes the tab from navigation
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          href: null, // This removes the tab from navigation
        }}
      />
    </Tabs>
  );
}
