import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/core/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ProgressBar } from 'react-native-paper';

type Step = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

type TaskRoadmapProps = {
  taskTitle: string;
  taskDescription: string;
  steps: Step[];
};

const TaskProgress = ({ completed, total }: { completed: number; total: number }) => (
  <View style={{ padding: 16 }}>
    <Text variant="h2" weight="bold" style={{ fontFamily: 'Poppins_700Bold', color: '#000' }}>
      Step {completed} of {total} done
    </Text>
    <ProgressBar
      progress={completed / total}
      color="#6200ee"
      style={{ height: 10, borderRadius: 5 }}
    />
  </View>
);

export const TaskRoadmap = ({
  taskTitle,
  taskDescription,
  steps: initialSteps,
}: TaskRoadmapProps) => {
  // Create a local state to manage step completion
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const completedSteps = steps.filter(step => step.isCompleted).length;

  // Function to toggle step completion
  const toggleStepCompletion = (stepId: string) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          {taskTitle}
        </Text>
        <Text variant="body" style={styles.description}>
          {taskDescription}
        </Text>
      </View>

      <TaskProgress completed={completedSteps} total={steps.length} />

      <FlatList
        data={steps}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text variant="h3" style={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text variant="body" style={styles.cardDescription}>
                  {item.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleStepCompletion(item.id)}
                style={styles.checkboxContainer}
              >
                <View style={item.isCompleted ? styles.filledCircleContainer : {}}>
                  {item.isCompleted ? (
                    <IconSymbol name="checkmark.circle.fill" size={28} color="#4CAF50" />
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: '#333',
    fontFamily: 'Poppins_700Bold',
  },
  cardDescription: {
    color: '#555',
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  checkboxContainer: {
    padding: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledCircleContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
});
