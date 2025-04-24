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
import { SetupGuidesService } from '@/lib/api/setupGuides';
import { SetupGuideCategoryRow } from '@/lib/supabase/client';

export default function GuidesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<SetupGuideCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await SetupGuidesService.getCategories();
      if (data) {
        // Sort by display_order
        setCategories(data.sort((a, b) => a.display_order - b.display_order));
      }
    } catch (error) {
      console.error('Error fetching guide categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const navigateToCategory = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: '/resources/guides/category/[id]' as any,
      params: { id: categoryId, name: categoryName },
    } as any);
  };

  const renderCategoryItem = ({ item }: { item: SetupGuideCategoryRow }) => (
    <TouchableOpacity
      onPress={() => navigateToCategory(item.id, item.name)}
      style={styles.categoryCard}
      activeOpacity={0.7}
    >
      <Card variant="elevated" containerStyle={styles.cardContainer}>
        <View style={styles.categoryContent}>
          <View style={[styles.iconContainer, { backgroundColor: getRandomColor(item.id) }]}>
            <IconSymbol name={item.icon_name || 'doc.text.fill'} size={32} color="#ffffff" />
          </View>
          <View style={styles.textContainer}>
            <Text variant="h3" weight="semibold">
              {item.name}
            </Text>
            {item.description && (
              <Text variant="body" color="#666" numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <IconSymbol name="chevron.right" size={20} color="#999" />
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Generate a consistent color based on the ID
  const getRandomColor = (id: string) => {
    const colors = [
      '#4a90e2', // Blue
      '#50c878', // Green
      '#f39c12', // Orange
      '#9b59b6', // Purple
      '#e74c3c', // Red
      '#3498db', // Light Blue
      '#1abc9c', // Teal
      '#f1c40f', // Yellow
    ];

    // Use the last character of the ID to select a color
    const index = parseInt(id.charAt(id.length - 1), 16) % colors.length;
    return colors[index];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <Text variant="h1" weight="bold">
          Setup Guides
        </Text>
      </View>

      <View style={styles.introContainer}>
        <Text variant="body" color="#666" style={styles.introText}>
          Browse our comprehensive guides to help you navigate your transition to studying in the
          United States.
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoryList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a90e2']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="doc.text.fill" size={48} color="#ccc" />
              <Text variant="body" color="#666" style={styles.emptyText}>
                No guide categories available at the moment.
              </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  introText: {
    lineHeight: 22,
  },
  categoryList: {
    padding: 20,
  },
  categoryCard: {
    marginBottom: 16,
  },
  cardContainer: {
    borderRadius: 12,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
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
    height: 300,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
