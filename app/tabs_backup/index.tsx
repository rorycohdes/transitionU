import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';

type AppRoute =
  | '/(tabs)/checklist'
  | '/(tabs)/roadmap'
  | '/(tabs)/profile'
  | '/(tabs)/resources'
  | '/(tabs)/forum'
  | '/(tabs)/assistant';

const QUICK_ACTIONS = [
  {
    icon: '📝',
    title: 'My Tasks',
    description: 'View and manage your transition tasks',
    route: '/(tabs)/checklist' as AppRoute,
  },
  {
    icon: '📅',
    title: 'Schedule',
    description: 'Important dates and deadlines',
    route: '/(tabs)/roadmap' as AppRoute,
  },
  {
    icon: '📊',
    title: 'Progress',
    description: 'Track your transition progress',
    route: '/(tabs)/profile' as AppRoute,
  },
];

const RESOURCES = [
  {
    icon: '🎓',
    title: 'Academic',
    description: 'Course materials and study resources',
    route: '/(tabs)/resources' as AppRoute,
  },
  {
    icon: '🏫',
    title: 'Campus Life',
    description: 'Housing, dining, and campus activities',
    route: '/(tabs)/forum' as AppRoute,
  },
  {
    icon: '🤝',
    title: 'Support',
    description: 'Counseling and support services',
    route: '/(tabs)/assistant' as AppRoute,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text variant="h1" weight="bold" style={styles.welcomeTitle}>
          Welcome to TransitionU
        </Text>
        <Text variant="body" color="#666" style={styles.welcomeSubtitle}>
          Your guide to a successful university transition
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="h2" weight="semibold" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionContainer}
        >
          {QUICK_ACTIONS.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(action.route)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text variant="h3" weight="semibold" style={styles.actionTitle}>
                {action.title}
              </Text>
              <Text variant="body" color="#666">
                {action.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resources Section */}
      <View style={styles.section}>
        <Text variant="h2" weight="semibold" style={styles.sectionTitle}>
          Resources
        </Text>
        <View style={styles.resourcesGrid}>
          {RESOURCES.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => router.push(resource.route)}
            >
              <Text style={styles.resourceIcon}>{resource.icon}</Text>
              <Text variant="h3" weight="semibold" style={styles.resourceTitle}>
                {resource.title}
              </Text>
              <Text variant="body" color="#666" numberOfLines={2}>
                {resource.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Need Help Section */}
      <TouchableOpacity
        style={styles.helpSection}
        onPress={() => router.push('/(tabs)/assistant' as AppRoute)}
      >
        <View style={styles.helpContent}>
          <View>
            <Text variant="h3" weight="semibold" style={styles.helpTitle}>
              Need Help?
            </Text>
            <Text variant="body" color="#666">
              Chat with our AI assistant
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#666" />
        </View>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: 24,
  },
  actionContainer: {
    paddingRight: 20,
  },
  actionCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  actionTitle: {
    marginBottom: 5,
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  resourceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resourceIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  resourceTitle: {
    marginBottom: 5,
  },
  helpSection: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    overflow: 'hidden',
  },
  helpContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpTitle: {
    marginBottom: 5,
  },
});
