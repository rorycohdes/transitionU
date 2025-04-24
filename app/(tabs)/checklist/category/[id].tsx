import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthContext';
import { ChecklistModel } from '@/lib/models/checklist';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { ChecklistStatus, Difficulty } from '@/lib/models/constants';
import { IconSymbol } from '@/components/ui/IconSymbol';

type ChecklistItem = {
  id: string;
  title: string;
  description: string | null;
  estimated_time: string | null;
  difficulty: string | null;
  required: boolean;
  resources: any | null;
  progress: {
    status: ChecklistStatus;
    notes: string | null;
    completed_at: string | null;
  };
};

export default function CategoryDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!id || !user) return;

    try {
      const itemsWithProgress = await ChecklistModel.getItemsWithProgress(
        profile?.id || user.id,
        profile?.visa_type
      );

      if (itemsWithProgress) {
        // Filter items for current category
        const categoryItems = itemsWithProgress.filter(item => item.category_id === id);
        setItems(categoryItems);
      }
    } catch (error) {
      console.error('Error fetching checklist items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  const updateItemStatus = async (itemId: string, status: ChecklistStatus) => {
    if (!user) return;

    setUpdatingItemId(itemId);

    try {
      const result = await ChecklistModel.updateProgress(profile?.id || user.id, itemId, status);

      if (result) {
        // Update local state
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  progress: {
                    ...item.progress,
                    status,
                    completed_at:
                      status === ChecklistStatus.COMPLETED ? new Date().toISOString() : null,
                  },
                }
              : item
          )
        );
      } else {
        Alert.alert('Error', 'Failed to update item status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
      Alert.alert('Error', 'An error occurred while updating item status.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleItemPress = (item: ChecklistItem) => {
    router.push({
      pathname: '../item/[id]',
      params: { id: item.id, name: item.title },
    });
  };

  const getStatusBadge = (status: ChecklistStatus) => {
    let bgColor, textColor, label;

    switch (status) {
      case ChecklistStatus.COMPLETED:
        bgColor = '#4CD964';
        textColor = '#FFFFFF';
        label = 'Completed';
        break;
      case ChecklistStatus.IN_PROGRESS:
        bgColor = '#007AFF';
        textColor = '#FFFFFF';
        label = 'In Progress';
        break;
      case ChecklistStatus.SKIPPED:
        bgColor = '#8E8E93';
        textColor = '#FFFFFF';
        label = 'Skipped';
        break;
      default:
        bgColor = '#EFEFEF';
        textColor = '#8E8E93';
        label = 'Not Started';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text
          style={{
            color: textColor,
            fontSize: 12,
            fontWeight: '600',
            fontFamily: 'Poppins_700Bold',
          }}
        >
          {label}
        </Text>
      </View>
    );
  };

  const getDifficultyIcon = (difficulty: string | null) => {
    if (!difficulty) return null;

    let color;
    let count;

    switch (difficulty) {
      case Difficulty.EASY:
        color = '#4CD964';
        count = 1;
        break;
      case Difficulty.MEDIUM:
        color = '#FF9500';
        count = 2;
        break;
      case Difficulty.HARD:
        color = '#FF3B30';
        count = 3;
        break;
      default:
        return null;
    }

    return (
      <View style={styles.difficultyContainer}>
        {Array.from({ length: count }).map((_, index) => (
          <IconSymbol key={index} name="star.fill" size={14} color={color} />
        ))}
      </View>
    );
  };

  const getStatusActionButtons = (item: ChecklistItem) => {
    const { status } = item.progress;

    if (updatingItemId === item.id) {
      return (
        <View style={styles.actionsContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }

    switch (status) {
      case ChecklistStatus.COMPLETED:
        return (
          <View style={styles.actionsContainer}>
            <Button
              label="Mark Incomplete"
              variant="outline"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.NOT_STARTED)}
            />
          </View>
        );
      case ChecklistStatus.IN_PROGRESS:
        return (
          <View style={styles.actionsContainer}>
            <Button
              label="Mark Complete"
              variant="primary"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.COMPLETED)}
              style={styles.actionButton}
            />
            <Button
              label="Not Started"
              variant="outline"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.NOT_STARTED)}
            />
          </View>
        );
      case ChecklistStatus.SKIPPED:
        return (
          <View style={styles.actionsContainer}>
            <Button
              label="Mark Not Started"
              variant="outline"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.NOT_STARTED)}
            />
          </View>
        );
      default: // NOT_STARTED
        return (
          <View style={styles.actionsContainer}>
            <Button
              label="Start Task"
              variant="primary"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.IN_PROGRESS)}
              style={styles.actionButton}
            />
            <Button
              label="Skip"
              variant="outline"
              size="small"
              onPress={() => updateItemStatus(item.id, ChecklistStatus.SKIPPED)}
            />
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading checklist items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: name ? String(name) : 'Checklist Category',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <IconSymbol name="chevron.left" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 70 }} // Add bottom padding for tab bar
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
        }
      >
        {items.length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>
              No items found in this category. Pull down to refresh.
            </Text>
          </Card>
        ) : (
          items.map(item => (
            <Card key={item.id} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.itemTitleContainer}>
                  {item.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                  <Text variant="h5" weight="bold" style={styles.itemTitle}>
                    {item.title}
                  </Text>
                </View>

                <View style={styles.itemStatusContainer}>
                  {getStatusBadge(item.progress.status)}
                  {getDifficultyIcon(item.difficulty)}
                </View>
              </TouchableOpacity>

              {item.description && (
                <Text variant="body" style={styles.itemDescription}>
                  {item.description}
                </Text>
              )}

              {item.estimated_time && (
                <View style={styles.timeEstimate}>
                  <IconSymbol name="clock" size={14} color="#666" />
                  <Text variant="caption" style={styles.timeText}>
                    Estimated time: {item.estimated_time}
                  </Text>
                </View>
              )}

              {getStatusActionButtons(item)}

              <TouchableOpacity style={styles.detailsButton} onPress={() => handleItemPress(item)}>
                <Text variant="body" color="#007AFF">
                  View Details
                </Text>
                <IconSymbol name="chevron.right" size={16} color="#007AFF" />
              </TouchableOpacity>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  emptyStateCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  itemCard: {
    marginBottom: 16,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  itemStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requiredBadge: {
    backgroundColor: '#FFD60A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  requiredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins_700Bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 4,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  itemDescription: {
    marginTop: 8,
    marginBottom: 12,
    color: '#444',
    fontFamily: 'Poppins_400Regular',
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    marginLeft: 4,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 12,
  },
  actionButton: {
    marginRight: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
});
