import React from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, Tabs } from 'expo-router';
import { TaskRoadmap } from '@/components/TaskRoadmap';
import { IconSymbol } from '@/components/ui/IconSymbol';

// This is example data - in a real app, you would fetch this from your data store
const taskSteps = {
  m1: {
    title: 'Apply for Student Visa',
    description: 'Follow these steps to successfully apply for your student visa',
    steps: [
      {
        id: '1',
        title: 'Gather Required Documents',
        description:
          'Collect your passport, academic records, financial statements, and acceptance letter',
        isCompleted: true,
      },
      {
        id: '2',
        title: 'Complete Visa Application Form',
        description: 'Fill out all required fields in the application form accurately',
        isCompleted: true,
      },
      {
        id: '3',
        title: 'Pay Visa Fees',
        description: 'Submit payment for visa processing through the official payment system',
        isCompleted: false,
      },
      {
        id: '4',
        title: 'Schedule Visa Interview',
        description: 'Book an appointment at your local embassy or consulate',
        isCompleted: false,
      },
      {
        id: '5',
        title: 'Attend Visa Interview',
        description: 'Present your documents and answer questions at the embassy',
        isCompleted: false,
      },
    ],
  },
  m2: {
    title: 'Find Accommodation',
    description: 'Steps to secure your housing near campus',
    steps: [
      {
        id: '1',
        title: 'Research Housing Options',
        description: 'Compare on-campus dorms and off-campus apartments for cost and convenience',
        isCompleted: true,
      },
      {
        id: '2',
        title: 'Contact Housing Office',
        description: 'Get information about availability and application deadlines',
        isCompleted: true,
      },
      {
        id: '3',
        title: 'Submit Housing Application',
        description: 'Complete all forms and provide required documentation',
        isCompleted: true,
      },
      {
        id: '4',
        title: 'Pay Housing Deposit',
        description: 'Make the initial payment to secure your accommodation',
        isCompleted: true,
      },
    ],
  },
  m3: {
    title: 'Register for Classes',
    description: 'Complete these steps to enroll in your courses',
    steps: [
      {
        id: '1',
        title: 'Review Course Catalog',
        description: 'Check available courses and their prerequisites',
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Meet Academic Advisor',
        description: 'Discuss your course selection and degree requirements',
        isCompleted: false,
      },
      {
        id: '3',
        title: 'Complete Registration',
        description: 'Register for your selected courses through the student portal',
        isCompleted: false,
      },
    ],
  },
  m4: {
    title: 'Open Local Bank Account',
    description: 'Set up your banking in your new location',
    steps: [
      {
        id: '1',
        title: 'Research Local Banks',
        description: 'Compare student accounts and their features',
        isCompleted: true,
      },
      {
        id: '2',
        title: 'Visit Bank and Open Account',
        description: 'Bring identification and required documents to the bank',
        isCompleted: false,
      },
    ],
  },
  o1: {
    title: 'Get Local SIM Card',
    description: 'Set up your mobile phone service',
    steps: [
      {
        id: '1',
        title: 'Compare Mobile Plans',
        description: 'Research different carriers and their student plans',
        isCompleted: true,
      },
      {
        id: '2',
        title: 'Purchase and Activate SIM',
        description: 'Buy your chosen plan and set up service',
        isCompleted: true,
      },
    ],
  },
  o3: {
    title: 'Understand Transportation',
    description: 'Learn how to navigate your new city',
    steps: [
      {
        id: '1',
        title: 'Get Transportation Map',
        description: 'Download transit maps and schedules',
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Learn Bus Routes',
        description: 'Identify key routes between home and campus',
        isCompleted: false,
      },
      {
        id: '3',
        title: 'Get Transit Card',
        description: 'Purchase and load a transit pass for regular use',
        isCompleted: false,
      },
      {
        id: '4',
        title: 'Practice Route to Campus',
        description: 'Take a test trip to familiarize yourself',
        isCompleted: false,
      },
      {
        id: '5',
        title: 'Download Transit Apps',
        description: 'Install apps for real-time transit information',
        isCompleted: false,
      },
    ],
  },
  o5: {
    title: 'Join Student Clubs',
    description: 'Get involved in campus activities',
    steps: [
      {
        id: '1',
        title: 'Attend Club Fair',
        description: 'Visit club booths and learn about different organizations',
        isCompleted: false,
      },
    ],
  },
  o6: {
    title: 'Visit Local Landmarks',
    description: 'Explore your new city and its culture',
    steps: [
      {
        id: '1',
        title: 'Create Landmarks List',
        description: 'Make a list of important places to visit',
        isCompleted: false,
      },
      {
        id: '2',
        title: 'Plan Routes',
        description: 'Organize efficient sightseeing routes',
        isCompleted: false,
      },
      {
        id: '3',
        title: 'Visit Historical Sites',
        description: 'Learn about local history and heritage',
        isCompleted: false,
      },
      {
        id: '4',
        title: 'Visit Modern Attractions',
        description: 'Experience contemporary city life',
        isCompleted: false,
      },
      {
        id: '5',
        title: 'Document Experiences',
        description: 'Take photos and notes of your visits',
        isCompleted: false,
      },
    ],
  },
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const taskId = typeof id === 'string' ? id : id[0];
  const taskData = taskSteps[taskId as keyof typeof taskSteps];

  if (!taskData) {
    return null; // Or render an error state
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen
        options={{
          title: taskData.title,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <IconSymbol name="chevron.left" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          ),
        }}
      />
      <TaskRoadmap
        taskTitle={taskData.title}
        taskDescription={taskData.description}
        steps={taskData.steps}
      />
    </SafeAreaView>
  );
}
