import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { Card } from '@/components/core/Card';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FAQService } from '@/lib/api/faq';
import { FAQCategory } from '@/lib/models/constants';
import { FAQItemRow } from '@/lib/supabase/client';

export default function FAQScreen() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Record<string, FAQItemRow[]>>({});
  const [filteredFaqs, setFilteredFaqs] = useState<Record<string, FAQItemRow[]>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqs(faqs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, FAQItemRow[]> = {};

    Object.entries(faqs).forEach(([category, items]) => {
      const filteredItems = items.filter(
        item =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(query)))
      );

      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });

    setFilteredFaqs(filtered);
  }, [searchQuery, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await FAQService.getFAQsGroupedByCategory();
      if (data) {
        setFaqs(data);
        setFilteredFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFAQs();
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const renderFAQItem = ({ item }: { item: FAQItemRow }) => (
    <TouchableOpacity onPress={() => toggleQuestion(item.id)} activeOpacity={0.7}>
      <Card
        variant="outlined"
        containerStyle={[styles.faqCard, expandedQuestions[item.id] && styles.faqCardExpanded]}
      >
        <View style={styles.questionContainer}>
          <Text variant="h4" weight="semibold" style={styles.questionText}>
            {item.question}
          </Text>
          <IconSymbol
            name={expandedQuestions[item.id] ? 'chevron.up' : 'chevron.down'}
            size={20}
            color="#4a90e2"
          />
        </View>
        {expandedQuestions[item.id] && (
          <View style={styles.answerContainer}>
            <Text variant="body" color="#666" style={styles.answerText}>
              {item.answer}
            </Text>
            {item.keywords && item.keywords.length > 0 && (
              <View style={styles.keywordsContainer}>
                {item.keywords.map((keyword, index) => (
                  <View key={index} style={styles.keywordTag}>
                    <Text variant="caption" color="#4a90e2">
                      {keyword}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderCategorySection = ({ item }: { item: [string, FAQItemRow[]] }) => {
    const [category, items] = item;
    const categoryName = getCategoryLabel(category);

    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text variant="h3" weight="bold" color="#333">
            {categoryName}
          </Text>
          <Text variant="caption" color="#666">
            {items.length} {items.length === 1 ? 'question' : 'questions'}
          </Text>
        </View>
        <FlatList
          data={items}
          renderItem={renderFAQItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      [FAQCategory.VISA]: 'Visa & Immigration',
      [FAQCategory.HOUSING]: 'Housing & Accommodation',
      [FAQCategory.ACADEMICS]: 'Academics & Classes',
      [FAQCategory.FINANCE]: 'Finance & Banking',
      [FAQCategory.HEALTH]: 'Health & Insurance',
      [FAQCategory.CULTURAL]: 'Cultural Adjustment',
      [FAQCategory.WORK]: 'Working & Internships',
      [FAQCategory.GENERAL]: 'General Information',
    };

    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <Text variant="h1" weight="bold">
          FAQ
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
        </View>
      ) : (
        <FlatList
          data={Object.entries(filteredFaqs)}
          renderItem={renderCategorySection}
          keyExtractor={([category]) => category}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a90e2']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="questionmark.circle" size={48} color="#ccc" />
              <Text variant="body" color="#666" style={styles.emptyText}>
                {searchQuery.length > 0
                  ? `No FAQ found matching "${searchQuery}"`
                  : 'No FAQ available at the moment.'}
              </Text>
            </View>
          }
        />
      )}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  faqCard: {
    marginBottom: 12,
    borderRadius: 10,
  },
  faqCardExpanded: {
    borderColor: '#4a90e2',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    flex: 1,
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  answerText: {
    lineHeight: 22,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  keywordTag: {
    backgroundColor: '#f0f5ff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
