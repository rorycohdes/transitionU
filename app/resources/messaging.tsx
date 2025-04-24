import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MessagingService } from '@/lib/api/messaging';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/core/Button';

type Conversation = {
  id: string;
  participants: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  }[];
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
  unread_count: number;
};

export default function MessagingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await MessagingService.getUserConversations(user.id);

      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const navigateToConversation = (conversationId: string) => {
    router.push({
      pathname: '/resources/messaging/conversation/[id]' as any,
      params: { id: conversationId },
    } as any);
  };

  const navigateToNewMessage = () => {
    router.push('/resources/messaging/new' as any);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    return conversation.participants.find(p => p.id !== user.id);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // Today: show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // Within a week: show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older: show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherPerson = getOtherParticipant(item);
    if (!otherPerson) return null;

    const fullName = `${otherPerson.first_name} ${otherPerson.last_name}`;
    const lastMessage = item.last_message;
    const isUnread = item.unread_count > 0;

    return (
      <TouchableOpacity onPress={() => navigateToConversation(item.id)} activeOpacity={0.7}>
        <Card
          variant="outlined"
          containerStyle={[styles.conversationCard, isUnread && styles.unreadCard]}
        >
          <View style={styles.conversationContent}>
            <View style={styles.avatarContainer}>
              {otherPerson.avatar_url ? (
                <Image source={{ uri: otherPerson.avatar_url }} style={styles.avatar} />
              ) : (
                <View
                  style={[styles.avatarPlaceholder, { backgroundColor: getAvatarColor(fullName) }]}
                >
                  <Text weight="semibold" color="#fff">
                    {getInitials(fullName)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text variant="h4" weight="semibold" numberOfLines={1}>
                  {fullName}
                </Text>
                {lastMessage && (
                  <Text variant="caption" color="#999">
                    {formatTimestamp(lastMessage.created_at)}
                  </Text>
                )}
              </View>

              {lastMessage ? (
                <Text
                  variant="body"
                  color={isUnread ? '#333' : '#666'}
                  weight={isUnread ? 'semibold' : 'regular'}
                  numberOfLines={1}
                  style={styles.previewText}
                >
                  {lastMessage.sender_id === user?.id ? 'You: ' : ''}
                  {lastMessage.content}
                </Text>
              ) : (
                <Text variant="body" color="#999" style={styles.previewText}>
                  No messages yet
                </Text>
              )}
            </View>

            {isUnread && (
              <View style={styles.unreadBadge}>
                <Text variant="caption" weight="semibold" color="#fff">
                  {item.unread_count}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4a90e2', // Blue
      '#50c878', // Green
      '#f39c12', // Orange
      '#9b59b6', // Purple
      '#e74c3c', // Red
    ];

    // Hash the name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <Text variant="h1" weight="bold">
          Messages
        </Text>
        <Button
          label="New"
          variant="primary"
          size="small"
          leftIcon={<IconSymbol name="plus" size={16} color="#fff" />}
          onPress={navigateToNewMessage}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a90e2']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="message.fill" size={48} color="#ccc" />
              <Text variant="body" color="#666" style={styles.emptyText}>
                No conversations yet. Start chatting with other students!
              </Text>
              <Button
                label="Start a Conversation"
                variant="primary"
                onPress={navigateToNewMessage}
                style={styles.emptyButton}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  listContent: {
    padding: 20,
  },
  conversationCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  unreadCard: {
    borderColor: '#4a90e2',
    backgroundColor: '#f8faff',
  },
  conversationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewText: {
    opacity: 0.8,
  },
  unreadBadge: {
    backgroundColor: '#4a90e2',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyButton: {
    marginTop: 16,
  },
});
