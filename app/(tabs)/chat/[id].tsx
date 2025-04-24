import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/core/Text';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define TAX_PROFESSIONAL constant directly since importing creates linter errors
const TAX_PROFESSIONAL = {
  name: 'Michael Chen',
  title: 'International Student Tax Specialist',
};

type Message = {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: Date;
};

export default function ChatScreen() {
  const router = useRouter();
  const { id, name, title, isVerified } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Load initial message if it exists (for Michael Chen)
  useEffect(() => {
    if (name === TAX_PROFESSIONAL.name && typeof global !== 'undefined') {
      // @ts-ignore
      const initialMessage = global.dmMessages?.[TAX_PROFESSIONAL.name];

      if (initialMessage) {
        setMessages([
          {
            id: '1',
            text: initialMessage,
            isSender: true,
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [name]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isSender: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate response from Michael Chen with delay
    if (name === TAX_PROFESSIONAL.name) {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for reaching out. I'd be happy to help with your tax questions. Could you tell me more about your specific situation? For example, which country are you from and what type of income do you have?",
          isSender: false,
          timestamp: new Date(),
        };
        setMessages(currentMessages => [...currentMessages, response]);

        // Auto scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1500);
    }

    // Auto scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerName}>{name as string}</Text>
              {isVerified === '1' && (
                <IconSymbol
                  name="checkmark.seal.fill"
                  size={14}
                  color="#007AFF"
                  style={styles.verifiedBadge}
                />
              )}
              {title && <Text style={styles.headerSubtitle}>{title as string}</Text>}
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messageContent}
        >
          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isSender ? styles.sentBubble : styles.receivedBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isSender ? styles.sentText : styles.receivedText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={inputText.trim() ? '#fff' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerTitle: {
    alignItems: 'center',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  verifiedBadge: {
    marginLeft: 5,
  },
  backButton: {
    marginLeft: 15,
    padding: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#87CEEB',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    // Add bottom padding to ensure content is visible above the tab bar
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    marginBottom: 50, // Add space for the tab bar to ensure content isn't covered
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#87CEEB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
