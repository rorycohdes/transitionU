import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Animated,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { ProgressBar } from 'react-native-paper';
import { IconSymbol } from '@/components/ui/IconSymbol';

const AchievementProgress = ({
  progress,
  totalCards,
}: {
  progress: number;
  totalCards: number;
}) => {
  // Calculate percentage of completion
  const completionPercentage = Math.round((progress / totalCards) * 100);

  return (
    <View style={{ padding: 16 }}>
      <Text
        variant="h4"
        weight="regular"
        style={{ fontFamily: 'Poppins_400Regular', color: '#666', marginBottom: 6 }}
      >
        {progress} of {totalCards} tasks completed ({completionPercentage}%)
      </Text>
      <ProgressBar
        progress={progress / totalCards}
        color="#6200ee"
        style={{ height: 10, borderRadius: 5 }}
      />
    </View>
  );
};

// Segmented Progress Bar Component
const SegmentedProgressBar = ({ completed, total }: { completed: number; total: number }) => {
  if (total === 0) return null; // Don't render if no subtasks

  const segments = [];
  for (let i = 0; i < total; i++) {
    segments.push(
      <View
        key={i}
        style={[
          styles.progressBarSegment,
          { backgroundColor: i < completed ? '#4CAF50' : '#e0e0e0' }, // Green if completed, grey otherwise
        ]}
      />
    );
  }

  return <View style={styles.progressBarContainer}>{segments}</View>; // Changed from dividerContainer to progressBarContainer
};

// Reusable Divider Component
const DividerWithText = ({ text }: { text: string }) => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{text}</Text>
    <View style={styles.dividerLine} />
  </View>
);

const TransitionTitle = ({ title }: { title: string }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [title]);

  return (
    <Animated.Text
      style={{ opacity: fadeAnim, fontSize: 24, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' }}
    >
      {title}
    </Animated.Text>
  );
};

// Extend the card type definition
type CardData = {
  id: string;
  title: string;
  description: string;
  totalSubtasks: number;
  completedSubtasks: number;
};

type CardStackProps = {
  cards: CardData[];
};

const CardStack = ({ cards }: CardStackProps) => {
  const router = useRouter();

  return (
    <FlatList
      data={cards}
      renderItem={({ item }: { item: CardData }) => {
        const isCompleted = item.completedSubtasks === item.totalSubtasks && item.totalSubtasks > 0;
        const hasSubtasks = item.totalSubtasks > 0;

        return (
          <View
            style={{
              padding: 16,
              marginVertical: 10,
              marginHorizontal: 20,
              backgroundColor: '#fff',
              borderRadius: 8,
              shadowColor: '#888',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 5,
              borderWidth: 1,
              borderColor: '#ccc',
            }}
          >
            <Pressable
              onPress={() =>
                hasSubtasks
                  ? router.push({
                      pathname: '/task/[id]',
                      params: { id: item.id },
                    })
                  : null
              }
              style={({ pressed }) => [
                {
                  opacity: pressed && hasSubtasks ? 0.7 : 1,
                  flex: 1,
                },
              ]}
            >
              <View>
                <Text variant="h3" style={{ color: '#333', fontFamily: 'Poppins_700Bold' }}>
                  {item.title}
                </Text>
                <Text variant="body" style={{ color: '#555', fontFamily: 'Poppins_400Regular' }}>
                  {item.description}
                </Text>
              </View>
            </Pressable>

            {/* Segmented Progress Bar - Conditionally render if totalSubtasks > 0 */}
            {item.totalSubtasks > 0 && (
              <SegmentedProgressBar completed={item.completedSubtasks} total={item.totalSubtasks} />
            )}

            {/* Progress Text */}
            {item.totalSubtasks > 0 && (
              <Text style={styles.progressText}>
                {isCompleted
                  ? 'Done'
                  : `${item.completedSubtasks} of ${item.totalSubtasks} completed`}
              </Text>
            )}
          </View>
        );
      }}
      keyExtractor={item => item.id}
    />
  );
};

export default function RoadmapScreen() {
  // State for mandatory and optional tasks
  const [mandatoryCards, setMandatoryCards] = useState<CardData[]>([
    {
      id: 'm1',
      title: 'Apply for Student Visa',
      description: 'Gather documents and submit application',
      totalSubtasks: 5,
      completedSubtasks: 2,
    },
    {
      id: 'm2',
      title: 'Find Accommodation',
      description: 'Research housing options near campus',
      totalSubtasks: 4,
      completedSubtasks: 4, // Example of a completed task
    },
    {
      id: 'm3',
      title: 'Register for Classes',
      description: 'Select courses and complete registration',
      totalSubtasks: 3,
      completedSubtasks: 0,
    },
    {
      id: 'm4',
      title: 'Open Local Bank Account',
      description: 'Compare banks and open an account',
      totalSubtasks: 2,
      completedSubtasks: 1,
    },
  ]);

  const [optionalCards, setOptionalCards] = useState<CardData[]>([
    {
      id: 'o1',
      title: 'Get Local SIM Card',
      description: 'Find a mobile plan and get a SIM',
      totalSubtasks: 2,
      completedSubtasks: 2, // Example of a completed task
    },
    {
      id: 'o2',
      title: 'Learn Basic Phrases',
      description: 'Study essential local language phrases',
      totalSubtasks: 0,
      completedSubtasks: 0,
    },
    {
      id: 'o3',
      title: 'Understand Transportation',
      description: 'Learn about local public transport options',
      totalSubtasks: 5,
      completedSubtasks: 0,
    },
    {
      id: 'o4',
      title: 'Explore Campus',
      description: 'Take a tour and locate key buildings',
      totalSubtasks: 0,
      completedSubtasks: 0,
    },
    {
      id: 'o5',
      title: 'Join Student Clubs',
      description: 'Find clubs related to your interests',
      totalSubtasks: 1,
      completedSubtasks: 0,
    },
    {
      id: 'o6',
      title: 'Visit Local Landmarks',
      description: 'Explore the city and nearby attractions',
      totalSubtasks: 5,
      completedSubtasks: 0,
    },
  ]);

  // Calculate the number of fully completed mandatory cards
  const completedMandatoryCards = mandatoryCards.filter(
    card => card.totalSubtasks > 0 && card.completedSubtasks === card.totalSubtasks
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TransitionTitle title="Transition Progress" />
        </View>

        <AchievementProgress
          progress={completedMandatoryCards}
          totalCards={mandatoryCards.length}
        />

        {/* Mandatory Divider */}
        <DividerWithText text="Mandatory" />

        <CardStack cards={mandatoryCards} />

        {/* Optional Divider */}
        <DividerWithText text="Optional" />

        {/* Optional Card Stack */}
        <CardStack cards={optionalCards} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#888',
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  progressText: {
    marginTop: 8,
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  achievementContainer: {
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  transitionTitle: {
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  titleContainer: {
    alignItems: 'center',
  },
  fadeView: {
    height: 300,
  },
  statusIconContainer: {
    padding: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarSegment: {
    flex: 1,
    height: 8,
    marginHorizontal: 1,
    borderRadius: 2,
  },
});
