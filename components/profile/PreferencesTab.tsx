import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Card } from '@/components/core/Card';
import { Text } from '@/components/core/Text';
import { useColorScheme } from '@/hooks/useColorScheme';

const PreferencesTab: React.FC = () => {
  const colorScheme = useColorScheme();
  const [notifyChecklist, setNotifyChecklist] = useState(true);
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyForumReplies, setNotifyForumReplies] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [darkTheme, setDarkTheme] = useState(colorScheme === 'dark');

  return (
    <>
      <Card>
        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Notification Preferences
        </Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Checklist Reminders
            </Text>
            <Text variant="caption" color="#666">
              Get reminders about pending checklist items
            </Text>
          </View>
          <Switch
            value={notifyChecklist}
            onValueChange={setNotifyChecklist}
            trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Upcoming Events
            </Text>
            <Text variant="caption" color="#666">
              Be notified about orientation, deadlines, and campus events
            </Text>
          </View>
          <Switch
            value={notifyEvents}
            onValueChange={setNotifyEvents}
            trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Forum Replies
            </Text>
            <Text variant="caption" color="#666">
              Get notified when someone replies to your posts
            </Text>
          </View>
          <Switch
            value={notifyForumReplies}
            onValueChange={setNotifyForumReplies}
            trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Direct Messages
            </Text>
            <Text variant="caption" color="#666">
              Receive notifications for new messages
            </Text>
          </View>
          <Switch
            value={notifyMessages}
            onValueChange={setNotifyMessages}
            trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
          />
        </View>
      </Card>

      <Card style={styles.themeCard}>
        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Appearance
        </Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Dark Theme
            </Text>
            <Text variant="caption" color="#666">
              Use dark colors for app background and elements
            </Text>
          </View>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: '#E0E0E0', true: '#4CD964' }}
          />
        </View>

        <Text variant="caption" color="#666" style={styles.themeNote}>
          Note: Theme changes will follow your system settings by default. This toggle allows you to
          override system preferences.
        </Text>
      </Card>

      <Card style={styles.dataCard}>
        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Data & Privacy
        </Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text variant="body" weight="medium">
              Allow Analytics
            </Text>
            <Text variant="caption" color="#666">
              Help us improve by sharing anonymous usage data
            </Text>
          </View>
          <Switch value={true} trackColor={{ false: '#E0E0E0', true: '#4CD964' }} />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  themeCard: {
    marginTop: 16,
  },
  themeNote: {
    marginTop: 16,
    fontStyle: 'italic',
  },
  dataCard: {
    marginTop: 16,
  },
});

export default PreferencesTab;
