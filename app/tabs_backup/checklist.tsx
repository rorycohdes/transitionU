import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthContext';
import { ChecklistModel } from '@/lib/models/checklist';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { ChecklistCategoryRow } from '@/lib/supabase/client';
import { ChecklistStatus } from '@/lib/models/constants';

export default function ChecklistScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<ChecklistCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState<{
    [key: string]: {
      total: number;
      completed: number;
      inProgress: number;
    };
  }>({});

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesData = await ChecklistModel.getCategories();

      if (categoriesData) {
        setCategories(categoriesData);

        // Initialize progress tracking object
        const progressObj: {
          [key: string]: { total: number; completed: number; inProgress: number };
        } = {};

        // Process each category to get progress stats
        for (const category of categoriesData) {
          const items = await ChecklistModel.getItemsByCategory(category.id);

          if (items && user) {
            // For each category, get all items with progress
            const itemsWithProgress = await ChecklistModel.getItemsWithProgress(
              profile?.id || user.id,
              profile?.visa_type
            );

            if (itemsWithProgress) {
              // Filter items for current category
              const categoryItems = itemsWithProgress.filter(
                item => item.category_id === category.id
              );

              // Calculate progress stats
              progressObj[category.id] = {
                total: categoryItems.length,
                completed: categoryItems.filter(
                  item => item.progress.status === ChecklistStatus.COMPLETED
                ).length,
                inProgress: categoryItems.filter(
                  item => item.progress.status === ChecklistStatus.IN_PROGRESS
                ).length,
              };
            }
          }
        }

        setCategoryProgress(progressObj);
      }
    } catch (error) {
      console.error('Error fetching checklist data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: '/checklist/category/[id]',
      params: { id: categoryId, name: categoryName },
    });
  };

  // Calculate total progress across all categories
  const calculateTotalProgress = () => {
    let totalItems = 0;
    let totalCompleted = 0;
    let totalInProgress = 0;

    Object.values(categoryProgress).forEach(progress => {
      totalItems += progress.total;
      totalCompleted += progress.completed;
      totalInProgress += progress.inProgress;
    });

    return {
      total: totalItems,
      completed: totalCompleted,
      inProgress: totalInProgress,
      percentage: totalItems > 0 ? Math.floor((totalCompleted / totalItems) * 100) : 0,
    };
  };

  const totalProgress = calculateTotalProgress();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your checklists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Your Checklists',
          headerLargeTitle: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Overall progress card */}
        <Card style={styles.progressCard}>
          <Text variant="h4" weight="bold" style={styles.progressTitle}>
            Your Progress
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${totalProgress.percentage}%` }]} />
          </View>

          <Text style={styles.progressPercentage}>{totalProgress.percentage}% Complete</Text>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text variant="h5" weight="bold" style={styles.statNumber}>
                {totalProgress.completed}
              </Text>
              <Text variant="caption">Completed</Text>
            </View>
            <View style={styles.progressStat}>
              <Text variant="h5" weight="bold" style={styles.statNumber}>
                {totalProgress.inProgress}
              </Text>
              <Text variant="caption">In Progress</Text>
            </View>
            <View style={styles.progressStat}>
              <Text variant="h5" weight="bold" style={styles.statNumber}>
                {totalProgress.total}
              </Text>
              <Text variant="caption">Total Tasks</Text>
            </View>
          </View>
        </Card>

        <Text variant="h4" weight="bold" style={styles.sectionTitle}>
          Checklist Categories
        </Text>

        {categories.length === 0 ? (
          <Card style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>
              No checklist categories found. Pull down to refresh.
            </Text>
          </Card>
        ) : (
          categories.map(category => {
            const progress = categoryProgress[category.id] || {
              total: 0,
              completed: 0,
              inProgress: 0,
            };
            const percentage =
              progress.total > 0 ? Math.floor((progress.completed / progress.total) * 100) : 0;

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id, category.name)}
                activeOpacity={0.7}
              >
                <Card style={styles.categoryCard}>
                  <Text variant="h5" weight="bold">
                    {category.name}
                  </Text>

                  {category.description && (
                    <Text variant="body" style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  )}

                  <View style={styles.categoryProgressContainer}>
                    <View style={styles.progressBarContainer}>
                      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                    </View>

                    <View style={styles.categoryProgressStats}>
                      <Text variant="body">
                        {progress.completed} of {progress.total} completed
                      </Text>
                      <Text variant="body" weight="bold">
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
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
  },
  progressCard: {
    marginBottom: 24,
    padding: 20,
  },
  progressTitle: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: 4,
    color: '#333',
  },
  sectionTitle: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryCard: {
    marginBottom: 16,
    padding: 16,
  },
  categoryDescription: {
    marginTop: 4,
    marginBottom: 16,
    color: '#666',
  },
  categoryProgressContainer: {
    marginTop: 12,
  },
  categoryProgressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  emptyStateCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
  },
});
