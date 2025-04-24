import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ChecklistItemDetail() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: name ? String(name) : 'Checklist Item',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <IconSymbol name="chevron.left" size={24} color="#0a7ea4" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Item Details</Text>
        <Text style={styles.idText}>ID: {id}</Text>
        <Text style={styles.nameText}>Name: {name}</Text>

        {/* You can add more detailed content here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  idText: {
    fontSize: 16,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
