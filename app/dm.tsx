import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define TAX_PROFESSIONAL constant directly since importing creates linter errors
const TAX_PROFESSIONAL = {
  name: 'Michael Chen',
  title: 'International Student Tax Specialist',
};

// Define message type
type DM = {
  id: string;
  name: string;
  title?: string;
  preview: string;
  unread: boolean;
  isVerified?: boolean;
};

export default function DirectMessagesScreen() {
  const router = useRouter();
  const [dms, setDms] = useState<DM[]>([]);

  // Load messages when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMessages();
      return () => {};
    }, [])
  );

  const loadMessages = () => {
    // Base messages that are always shown
    const baseDms: DM[] = [
      { id: '1', name: 'AquaPenguin', preview: 'Hey, about that visa question...', unread: true },
      {
        id: '2',
        name: 'Housing Helper Bot',
        preview: 'We found 3 new listings matching...',
        unread: false,
      },
      {
        id: '3',
        name: 'CrimsonFox',
        preview: 'Thanks for the tip on the CS class!',
        unread: false,
      },
    ];

    // Check if we have a message for Michael Chen in the global state
    if (
      typeof global !== 'undefined' &&
      // @ts-ignore
      global.dmMessages &&
      // @ts-ignore
      global.dmMessages[TAX_PROFESSIONAL.name]
    ) {
      // Create a DM entry for Michael Chen with the sent message
      const michaelChenDm: DM = {
        id: 'tax-specialist',
        name: TAX_PROFESSIONAL.name,
        title: TAX_PROFESSIONAL.title,
        // @ts-ignore
        preview: truncateMessage(global.dmMessages[TAX_PROFESSIONAL.name]),
        unread: false,
        isVerified: true,
      };

      // Add Michael Chen to the top of the list
      setDms([michaelChenDm, ...baseDms]);
    } else {
      setDms(baseDms);
    }
  };

  // Helper to truncate long messages for preview
  const truncateMessage = (message: string, length = 40) => {
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  };

  // Navigate to chat detail screen
  const navigateToChat = (dm: DM) => {
    if (dm.name === TAX_PROFESSIONAL.name) {
      // Use a proper routing pattern that's supported by Expo router
      router.push({
        pathname: '/(tabs)/chat/[id]',
        params: {
          id: dm.id,
          name: dm.name,
          title: dm.title || '',
          isVerified: dm.isVerified ? '1' : '0',
        },
      } as any);
    } else {
      // For other chats (could implement later)
      router.push({
        pathname: '/(tabs)/chat/[id]',
        params: { id: dm.id, name: dm.name },
      } as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Configure header */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Messages',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.replace('/');
                router.push('/(tabs)/forum');
              }}
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* DM list */}
        {dms.map(dm => (
          <TouchableOpacity key={dm.id} style={styles.dmItem} onPress={() => navigateToChat(dm)}>
            <View style={styles.dmTextContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.dmName, dm.unread && styles.dmUnread]}>{dm.name}</Text>
                {dm.isVerified && (
                  <IconSymbol
                    name="checkmark.seal.fill"
                    size={14}
                    color="#007AFF"
                    style={styles.verifiedBadge}
                  />
                )}
              </View>

              {dm.title && <Text style={styles.dmTitle}>{dm.title}</Text>}

              <Text style={styles.dmPreview} numberOfLines={1}>
                {dm.preview}
              </Text>
            </View>
            {dm.unread && <View style={styles.unreadDot} />}
            <IconSymbol name="chevron.right" size={18} color="#C7C7CC" style={styles.chevron} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // White background for DMs
  },
  backButton: {
    marginLeft: 15,
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dmTextContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dmName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'Poppins_400Regular',
  },
  verifiedBadge: {
    marginLeft: 5,
  },
  dmTitle: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 3,
    fontFamily: 'Poppins_400Regular',
  },
  dmUnread: {
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  dmPreview: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  chevron: {
    marginLeft: 5,
  },
});
