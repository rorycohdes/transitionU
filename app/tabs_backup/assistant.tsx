import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '@/components/core/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';

const FAQ_ITEMS = [
  {
    icon: '🎓',
    title: 'Plan my studies',
    description: 'Help me create a study schedule...',
  },
  {
    icon: '📚',
    title: 'Course selection',
    description: 'Recommend courses based on my goals...',
  },
  {
    icon: '🏫',
    title: 'Campus life',
    description: 'Tips for adapting to campus life...',
  },
  {
    icon: '💼',
    title: 'Career planning',
    description: 'Guide me through career options...',
  },
];

export default function AssistantScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeButton}>
        <IconSymbol name="xmark" size={24} color="#999" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          TransitionU <Text style={styles.aiText}>AI</Text> ✨
        </Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.greeting}>Hi there!</Text>
        <Text style={styles.question}>What do you need help with today?</Text>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.faqScrollContent}
        >
          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.faqButton}>
              <Text style={styles.faqIcon}>{item.icon}</Text>
              <Text style={styles.faqTitle}>{item.title}</Text>
              <Text style={styles.faqDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Input - Moved here */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tell me your plans..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.micButton}>
          <IconSymbol name="mic.fill" size={20} color="#87CEEB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton}>
          <IconSymbol name="camera.fill" size={20} color="#87CEEB" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
  },
  aiText: {
    color: '#87CEEB',
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 36,
    fontWeight: '600',
    color: '#87CEEB',
    marginBottom: 10,
  },
  question: {
    fontSize: 36,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  micButton: {
    marginLeft: 10,
    padding: 5,
  },
  cameraButton: {
    marginLeft: 10,
    padding: 5,
  },
  faqContainer: {
    marginTop: 'auto',
    marginBottom: 60,
  },
  faqScrollContent: {
    paddingHorizontal: 15,
  },
  faqButton: {
    width: 200,
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  faqIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  faqDescription: {
    fontSize: 14,
    color: '#666',
  },
});
