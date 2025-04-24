import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AchievementsService } from '@/lib/api/achievements';
import { AchievementCategory } from '@/lib/models/constants';
import { useAuth } from '@/lib/auth/AuthContext';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

type UserAchievement = {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  category: AchievementCategory;
  points: number;
  earned: boolean;
  earned_at: string | null;
};

type CategoryTab = AchievementCategory | 'all';

export default function AchievementsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all');
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await AchievementsService.getUserAchievementsWithDetails(user.id);

      if (data) {
        setAchievements(data);

        // Calculate points
        let total = 0;
        let earned = 0;

        data.forEach(achievement => {
          total += achievement.points;
          if (achievement.earned) {
            earned += achievement.points;
          }
        });

        setTotalPoints(total);
        setEarnedPoints(earned);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAchievements();
  };

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const getCompletionPercentage = () => {
    if (totalPoints === 0) return 0;
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const getCategoryIcon = (category: AchievementCategory): string => {
    switch (category) {
      case AchievementCategory.PRE_ARRIVAL:
        return 'airplane';
      case AchievementCategory.POST_ARRIVAL:
        return 'house.fill';
      case AchievementCategory.COMMUNITY:
        return 'person.3.fill';
      case AchievementCategory.ACADEMIC:
        return 'book.fill';
      default:
        return 'trophy.fill';
    }
  };

  const getCategoryName = (category: AchievementCategory): string => {
    switch (category) {
      case AchievementCategory.PRE_ARRIVAL:
        return 'Pre-Arrival';
      case AchievementCategory.POST_ARRIVAL:
        return 'Post-Arrival';
      case AchievementCategory.COMMUNITY:
        return 'Community';
      case AchievementCategory.ACADEMIC:
        return 'Academic';
      default:
        return category;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <Text variant="h1" weight="bold">
          Achievements
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a90e2']} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4a90e2" />
          </View>
        ) : (
          <>
            <Card variant="elevated" containerStyle={styles.statsCard}>
              <View style={styles.statsContent}>
                <View style={styles.statsTextContainer}>
                  <Text variant="h2" weight="bold" color="#4a90e2">
                    {earnedPoints}
                  </Text>
                  <Text variant="body" color="#666">
                    points earned
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]}
                    />
                  </View>
                  <Text variant="caption" color="#666">
                    {getCompletionPercentage()}% complete
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.categoryTabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.categoryTab,
                    selectedCategory === 'all' && styles.categoryTabSelected,
                  ]}
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text
                    variant="label"
                    weight="semibold"
                    color={selectedCategory === 'all' ? '#fff' : '#4a90e2'}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                {Object.values(AchievementCategory).map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryTab,
                      selectedCategory === category && styles.categoryTabSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      variant="label"
                      weight="semibold"
                      color={selectedCategory === category ? '#fff' : '#4a90e2'}
                    >
                      {getCategoryName(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.achievementsContainer}>
              {filteredAchievements.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <IconSymbol name="trophy.fill" size={48} color="#ccc" />
                  <Text variant="body" color="#666" style={styles.emptyText}>
                    No achievements in this category yet.
                  </Text>
                </View>
              ) : (
                filteredAchievements.map(achievement => (
                  <Card
                    key={achievement.id}
                    variant={achievement.earned ? 'elevated' : 'outlined'}
                    containerStyle={[
                      styles.achievementCard,
                      achievement.earned ? styles.achievementEarned : styles.achievementLocked,
                    ]}
                  >
                    <View style={styles.achievementHeader}>
                      <View
                        style={[
                          styles.achievementIconContainer,
                          {
                            backgroundColor: achievement.earned ? '#f1c40f' : '#e0e0e0',
                          },
                        ]}
                      >
                        <IconSymbol
                          name={achievement.icon_name || getCategoryIcon(achievement.category)}
                          size={24}
                          color={achievement.earned ? '#fff' : '#999'}
                        />
                      </View>
                      <View style={styles.achievementTitleContainer}>
                        <Text
                          variant="h4"
                          weight="semibold"
                          color={achievement.earned ? '#333' : '#999'}
                        >
                          {achievement.title}
                        </Text>
                        <Text variant="caption" color={achievement.earned ? '#666' : '#999'}>
                          {achievement.points} points • {getCategoryName(achievement.category)}
                        </Text>
                      </View>
                      {achievement.earned && (
                        <IconSymbol name="checkmark.seal.fill" size={24} color="#4a90e2" />
                      )}
                    </View>
                    <Text
                      variant="body"
                      color={achievement.earned ? '#666' : '#999'}
                      style={styles.achievementDescription}
                    >
                      {achievement.description}
                    </Text>
                    {achievement.earned && achievement.earned_at && (
                      <Text variant="caption" color="#999" style={styles.earnedDate}>
                        Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                      </Text>
                    )}
                  </Card>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  statsCard: {
    margin: 20,
    borderRadius: 12,
  },
  statsContent: {
    padding: 16,
  },
  statsTextContainer: {
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 5,
  },
  categoryTabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  categoryTabSelected: {
    backgroundColor: '#4a90e2',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  achievementEarned: {
    borderWidth: 0,
  },
  achievementLocked: {
    borderColor: '#e0e0e0',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTitleContainer: {
    flex: 1,
  },
  achievementDescription: {
    marginBottom: 8,
  },
  earnedDate: {
    textAlign: 'right',
  },
  loaderContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
