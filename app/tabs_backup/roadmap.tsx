import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Animated,
  FlatList,
  Pressable,
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
}) => (
  <View style={{ padding: 16 }}>
    <Text variant="h2" weight="bold" style={{ fontFamily: 'Poppins_700Bold', color: '#000' }}>
      Task {progress} of {totalCards} done
    </Text>
    <ProgressBar
      progress={progress / totalCards}
      color="#6200ee"
      style={{ height: 10, borderRadius: 5 }}
    />
  </View>
);

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

const CardStack = ({ cards }: { cards: CardData[] }) => {
  const router = useRouter();

  return (
    <FlatList
      data={cards}
      renderItem={({ item }: { item: CardData }) => {
        const isCompleted = item.completedSubtasks === item.totalSubtasks && item.totalSubtasks > 0;
        const hasSubtasks = item.totalSubtasks > 0;

        return (
          <Pressable
            onPress={() => (hasSubtasks ? router.push(`/task/${item.id}`) : null)}
            style={({ pressed }) => [
              {
                opacity: pressed && hasSubtasks ? 0.7 : 1,
              },
            ]}
          >
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="h3" style={{ color: '#333', fontFamily: 'Poppins_700Bold' }}>
                    {item.title}
                  </Text>
                  <Text variant="body" style={{ color: '#555', fontFamily: 'Poppins_400Regular' }}>
                    {item.description}
                  </Text>
                </View>
                {isCompleted && (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={24}
                    color="#4CAF50"
                    style={{ marginLeft: 10 }}
                  />
                )}
              </View>

              {/* Segmented Progress Bar - Conditionally render if totalSubtasks > 0 */}
              {item.totalSubtasks > 0 && (
                <SegmentedProgressBar
                  completed={item.completedSubtasks}
                  total={item.totalSubtasks}
                />
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
          </Pressable>
        );
      }}
      keyExtractor={item => item.id}
    />
  );
};

export default function RoadmapScreen() {
  const progress = 0; // Example progress value

  // Mandatory Tasks
  const mandatoryCards = [
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
  ];

  // Optional Tasks
  const optionalCards = [
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TransitionTitle title="Transition Progress" />
        </View>

        <AchievementProgress progress={progress} totalCards={mandatoryCards.length} />

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
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
    position: 'relative',
  },
  progressBarContainer: {
    // Style for the segmented bar container
    flexDirection: 'row',
    height: 6, // Adjust height as needed
    borderRadius: 3,
    overflow: 'hidden', // Ensures segments stay within rounded corners
    marginTop: 10,
  },
  progressBarSegment: {
    // Style for individual segments
    flex: 1, // Each segment takes equal width
    // Add a small margin between segments if desired:
    // marginRight: 1,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  progressText: {
    // Style for the progress text below the bar
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'right',
  },
  contentPlaceholder: {
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    height: 300,
  },
});
