import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserModel } from '@/lib/models/user';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { VisaType } from '@/lib/models/constants';
import ProfileTab from '@/components/profile/ProfileTab';
import AccountTab from '@/components/profile/AccountTab';
import PreferencesTab from '@/components/profile/PreferencesTab';

type ProfileTabs = 'profile' | 'account' | 'preferences';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const [selectedTab, setSelectedTab] = useState<ProfileTabs>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <ProfileTab profile={profile} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case 'account':
        return <AccountTab user={user} />;
      case 'preferences':
        return <PreferencesTab />;
      default:
        return <ProfileTab profile={profile} isEditing={isEditing} setIsEditing={setIsEditing} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Settings' }} />

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              profile?.avatar_url
                ? { uri: profile.avatar_url }
                : require('@/assets/images/default-avatar.png')
            }
            style={styles.avatar}
          />
          <Text variant="h3" weight="bold" style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text variant="body" color="#666" style={styles.email}>
            {user?.email}
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'profile' && styles.selectedTab]}
          onPress={() => setSelectedTab('profile')}
        >
          <Text
            variant="body"
            weight={selectedTab === 'profile' ? 'bold' : 'regular'}
            color={selectedTab === 'profile' ? '#007AFF' : '#666'}
          >
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'account' && styles.selectedTab]}
          onPress={() => setSelectedTab('account')}
        >
          <Text
            variant="body"
            weight={selectedTab === 'account' ? 'bold' : 'regular'}
            color={selectedTab === 'account' ? '#007AFF' : '#666'}
          >
            Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'preferences' && styles.selectedTab]}
          onPress={() => setSelectedTab('preferences')}
        >
          <Text
            variant="body"
            weight={selectedTab === 'preferences' ? 'bold' : 'regular'}
            color={selectedTab === 'preferences' ? '#007AFF' : '#666'}
          >
            Preferences
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>

      <View style={styles.footer}>
        <Button label="Sign Out" variant="outline" fullWidth onPress={signOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    marginBottom: 4,
  },
  email: {
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
