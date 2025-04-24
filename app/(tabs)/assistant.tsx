import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define TAX_PROFESSIONAL directly in this file to avoid import issues
const TAX_PROFESSIONAL = {
  name: 'Michael Chen',
  title: 'International Student Tax Specialist',
  description:
    'Certified tax advisor specializing in non-resident filing requirements and tax treaties for international students.',
  profileImage: 'https://example.com/path-to-image.jpg', // This would be replaced with an actual image path
};

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

// Message types
type MessageType = 'user' | 'ai';

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
  includeEditable?: boolean;
  editableText?: string;
}

// AI Message component
const AIMessage = ({ message }: { message: Message }) => {
  const [editableContent, setEditableContent] = useState(message.editableText || '');
  const router = useRouter();

  // Function to handle sending a message to Michael Chen
  const handleSendMessage = () => {
    if (!editableContent.trim()) {
      Alert.alert('Empty Message', 'Please enter a message before sending.');
      return;
    }

    // Store message in global state or async storage for persistence across screens
    // For demo purposes, we'll use a simple global variable
    // In a real app, this should use a proper state management solution
    if (typeof global !== 'undefined') {
      // @ts-ignore
      if (!global.dmMessages) {
        // @ts-ignore
        global.dmMessages = {};
      }
      // @ts-ignore
      global.dmMessages[TAX_PROFESSIONAL.name] = editableContent;
    }

    // Navigate to DM screen
    Alert.alert('Message Sent', `Your message to ${TAX_PROFESSIONAL.name} has been sent.`, [
      {
        text: 'View Message',
        onPress: () => router.push('/(tabs)/dm'),
      },
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.aiMessageContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>AI</Text>
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.aiMessageText}>{message.text}</Text>

        {message.includeEditable && (
          <View style={styles.editableMessageContainer}>
            <View style={styles.recipientHeader}>
              <Text style={styles.editableLabel}>Message to:</Text>
              <Text style={styles.recipientName}>{TAX_PROFESSIONAL.name}</Text>
              <Text style={styles.recipientTitle}>{TAX_PROFESSIONAL.title}</Text>
            </View>
            <View style={styles.editableContent}>
              <TextInput
                style={styles.editableInput}
                value={editableContent}
                onChangeText={setEditableContent}
                multiline
                placeholder="Edit this message..."
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <IconSymbol name="paperplane.fill" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// User Message component
const UserMessage = ({ message }: { message: Message }) => {
  return (
    <View style={styles.userMessageContainer}>
      <View style={styles.userMessageContent}>
        <Text style={styles.userMessageText}>{message.text}</Text>
      </View>
    </View>
  );
};

// AI Loading Indicator component
const LoadingBubble = () => {
  // Create animated values for each bubble
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;

  // Create animation sequence
  useEffect(() => {
    const animateBubble = (bubble: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.timing(bubble, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(bubble, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
    };

    // Create animation loop
    const loopAnimation = () => {
      Animated.loop(
        Animated.stagger(200, [
          animateBubble(bubble1, 0),
          animateBubble(bubble2, 0),
          animateBubble(bubble3, 0),
        ])
      ).start();
    };

    loopAnimation();

    return () => {
      // Cleanup animation if needed
      bubble1.stopAnimation();
      bubble2.stopAnimation();
      bubble3.stopAnimation();
    };
  }, []);

  // Map animation value to translateY
  const translateY1 = bubble1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const translateY2 = bubble2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const translateY3 = bubble3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View style={styles.aiMessageContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>AI</Text>
      </View>
      <View style={styles.messageContent}>
        <View style={styles.loadingBubbleContainer}>
          <Animated.View
            style={[styles.loadingBubble, { transform: [{ translateY: translateY1 }] }]}
          />
          <Animated.View
            style={[styles.loadingBubble, { transform: [{ translateY: translateY2 }] }]}
          />
          <Animated.View
            style={[styles.loadingBubble, { transform: [{ translateY: translateY3 }] }]}
          />
        </View>
      </View>
    </View>
  );
};

export default function AssistantScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages([...messages, newUserMessage]);
    setInputText('');
    setChatStarted(true);

    // Show AI typing indicator
    setIsAiTyping(true);

    // Scroll to bottom to show the typing indicator
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response (with a small delay)
    setTimeout(() => {
      const isForTaxHelp =
        inputText.toLowerCase().includes('tax') ||
        inputText.toLowerCase().includes('help me find someone knowledge in taxes');

      let aiResponse: Message;

      if (isForTaxHelp) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: `I see you're looking for tax expertise! I found ${TAX_PROFESSIONAL.name}, an ${TAX_PROFESSIONAL.title}, who recently posted in our community forum offering services specifically for international students. He specializes in non-resident filing requirements and tax treaties. I've drafted a message you can personalize and send directly to him:`,
          timestamp: new Date(),
          includeEditable: true,
          editableText: `"Hello ${TAX_PROFESSIONAL.name},\n\nI'm a TransitionU student looking for assistance with tax-related matters as an international student. I found your post in the community forum and would appreciate your expertise on [specific tax issue or question]. Please let me know if you're available for a consultation and what your rates are.\n\nThank you!"`,
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          text: `Thanks for your message! I'm TransitionU AI, your personal assistant for university life. I'd be happy to help with "${inputText}". What specific information are you looking for?`,
          timestamp: new Date(),
        };
      }

      // Hide typing indicator and show the actual response
      setIsAiTyping(false);
      setMessages(currentMessages => [...currentMessages, aiResponse]);

      // Scroll to bottom after new message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2500); // Longer delay to show the typing indicator

    Keyboard.dismiss();
  };

  // Handle FAQ item clicks
  const handleFaqClick = (faqItem: (typeof FAQ_ITEMS)[0]) => {
    const faqMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: faqItem.title,
      timestamp: new Date(),
    };

    setMessages([faqMessage]);
    setChatStarted(true);

    // Show AI typing indicator
    setIsAiTyping(true);

    // Scroll to bottom to show the typing indicator
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response for FAQ item
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: `I'd be happy to help you ${faqItem.title.toLowerCase()}! Could you tell me more about your specific needs?`,
        timestamp: new Date(),
      };

      // Hide typing indicator and show the actual response
      setIsAiTyping(false);
      setMessages(currentMessages => [...currentMessages, aiResponse]);

      // Scroll to bottom after new message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color="#999" />
        </TouchableOpacity>

        {/* Main Content ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, chatStarted && styles.chatStartedContent]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo - Always visible */}
          <View
            style={[
              styles.logoContainer,
              chatStarted ? { marginBottom: 20 } : { marginBottom: 40 },
            ]}
          >
            <Text style={styles.logoText}>
              TransitionU <Text style={styles.aiText}>AI</Text> ✨
            </Text>
          </View>

          {/* Welcome Message - Only visible when chat hasn't started */}
          {!chatStarted && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.greeting}>Hi there!</Text>
              <Text style={styles.question}>What do you need help with today?</Text>
            </View>
          )}

          {/* FAQ Section - Only visible when chat hasn't started */}
          {!chatStarted && (
            <View style={styles.faqContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.faqScrollContent}
              >
                {FAQ_ITEMS.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.faqButton}
                    onPress={() => handleFaqClick(item)}
                  >
                    <Text style={styles.faqIcon}>{item.icon}</Text>
                    <Text style={styles.faqTitle}>{item.title}</Text>
                    <Text style={styles.faqDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Chat Messages - Only visible when chat has started */}
          {chatStarted && (
            <View style={styles.messagesContainer}>
              {messages.map(message =>
                message.type === 'ai' ? (
                  <AIMessage key={message.id} message={message} />
                ) : (
                  <UserMessage key={message.id} message={message} />
                )
              )}

              {/* Show typing indicator when AI is "thinking" */}
              {isAiTyping && <LoadingBubble />}
            </View>
          )}
        </ScrollView>

        {/* Chat Input - Fixed at bottom */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tell me your plans..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <IconSymbol name="paperplane.fill" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  chatStartedContent: {
    paddingBottom: 20,
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
    marginTop: 20,
  },
  greeting: {
    fontSize: 36,
    fontWeight: '600',
    color: '#87CEEB',
    marginBottom: 16,
  },
  question: {
    fontSize: 36,
    fontWeight: '600',
    color: '#333',
    lineHeight: 44,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
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
  sendButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#87CEEB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
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
    marginBottom: 20,
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
  messagesContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  userMessageContainer: {
    marginVertical: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userMessageContent: {
    backgroundColor: '#87CEEB',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '85%',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  messageContent: {
    flex: 1,
  },
  aiMessageText: {
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  editableMessageContainer: {
    marginTop: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recipientHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 10,
  },
  editableLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recipientTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  editableContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  editableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 80,
    fontSize: 15,
    color: '#333',
  },
  loadingBubbleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  loadingBubble: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 3,
  },
});
