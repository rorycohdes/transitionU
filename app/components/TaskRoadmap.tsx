import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from '@/components/core/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ProgressBar } from 'react-native-paper';

type SubTask = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

type TaskRoadmapProps = {
  taskTitle: string;
  subtasks: SubTask[];
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

export const TaskRoadmap = ({ taskTitle, subtasks }: TaskRoadmapProps) => {
  const completedTasks = subtasks.filter(task => task.isCompleted).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          {taskTitle}
        </Text>
      </View>

      <TaskProgress completed={completedTasks} total={subtasks.length} />

      <FlatList
        data={subtasks}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text variant="h3" style={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text variant="body" style={styles.cardDescription}>
                  {item.description}
                </Text>
              </View>
              {item.isCompleted && (
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={24}
                  color="#4CAF50"
                  style={{ marginLeft: 10 }}
                />
              )}
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
  },
  cardContent: {
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
});
