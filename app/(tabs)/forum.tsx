import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { Button } from '@/components/core/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define TAX_PROFESSIONAL directly in this file to avoid import issues
const TAX_PROFESSIONAL = {
  name: 'Michael Chen',
  title: 'International Student Tax Specialist',
  description:
    'Certified tax advisor specializing in non-resident filing requirements and tax treaties for international students.',
  profileImage: 'https://example.com/path-to-image.jpg', // This would be replaced with an actual image path
};

// Define the structure for our mock post data (Reddit-style with anonymous author)
type MockPost = {
  id: string;
  anonymousAuthor: string; // Generated anonymous name
  category: string;
  title: string;
  contentSnippet: string;
  upvotes: number;
  commentsCount: number;
  timestamp: Date;
  isPromoted?: boolean; // Flag for promoted/sponsored posts
  actualAuthor?: {
    name: string;
    title: string;
    profileImage?: string;
  }; // For verified professionals
};

// Pool of anonymous names
const anonymousNames = [
  'AquaPenguin',
  'CrimsonFox',
  'SilentOwl',
  'GoldenBear',
  'ShadowWolf',
  'MysticDeer',
  'ElectricTiger',
  'CosmicBadger',
  'IronHawk',
  'VelvetDragon',
];

// Seed mock data with anonymous authors
const mockPosts: MockPost[] = [
  {
    id: 'post1',
    anonymousAuthor: anonymousNames[0],
    category: 'Visa',
    title: 'F-1 Visa Interview - What documents are absolutely essential?',
    contentSnippet:
      "My interview is next week and I'm panicking! Besides the I-20 and passport, what else did you bring that was helpful? Any unexpected questions?",
    upvotes: 28,
    commentsCount: 12,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'post2',
    anonymousAuthor: anonymousNames[1],
    category: 'Housing',
    title: 'Best neighborhoods near campus for quiet study?',
    contentSnippet:
      "Looking for apartment recommendations. Need a place that's relatively quiet, safe, and has decent internet. Budget around $1500/month.",
    upvotes: 15,
    commentsCount: 6,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'post3',
    anonymousAuthor: anonymousNames[2],
    category: 'Academics',
    title: 'CS Course Registration Help - Professor Smith vs Professor Jones for Intro Algo?',
    contentSnippet:
      'Heard mixed reviews about both. Which professor is better for someone without a strong theory background? Any tips for the coursework?',
    upvotes: 35,
    commentsCount: 18,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'post4',
    anonymousAuthor: anonymousNames[3],
    category: 'Social',
    title: 'How to make friends during orientation week?',
    contentSnippet:
      'Feeling a bit overwhelmed about meeting new people in a new country. Any icebreakers or events that are good for connecting?',
    upvotes: 42,
    commentsCount: 25,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'post5',
    anonymousAuthor: anonymousNames[4],
    category: 'Finance',
    title: 'Cheapest way to transfer money internationally?',
    contentSnippet:
      'Trying to avoid high bank fees when paying tuition or receiving money from home. What services have you found reliable and cost-effective?',
    upvotes: 19,
    commentsCount: 9,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  // Moved to the bottom - Tax professional sponsored post
  {
    id: 'post-promoted',
    anonymousAuthor: '', // Not anonymous since it's a professional
    category: 'Finance',
    title: 'Tax Filing Services for International Students - Special Rates',
    contentSnippet:
      "Hello TransitionU community! I'm offering specialized tax preparation services for international students. Services include: ITIN applications, non-resident returns (Form 1040NR), tax treaty benefits, and scholarship/fellowship tax guidance. 20% discount for TransitionU students using code 'TRANSITION2023'. Feel free to DM me with questions!",
    upvotes: 45,
    commentsCount: 8,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isPromoted: true,
    actualAuthor: {
      name: TAX_PROFESSIONAL.name,
      title: TAX_PROFESSIONAL.title,
      profileImage: TAX_PROFESSIONAL.profileImage,
    },
  },
];

// --- RedditPostCard component (modified for anonymous author) ---
// Helper function for time formatting (retained)
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + 'y ago';
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + 'mo ago';
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + 'd ago';
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + 'h ago';
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + 'm ago';
  return Math.floor(seconds) + 's ago';
}

const RedditPostCard = ({ post }: { post: MockPost }) => (
  <View style={[styles.postCardContainer, post.isPromoted && styles.promotedPostContainer]}>
    {/* Left Column: Votes */}
    <View style={styles.voteContainer}>
      <TouchableOpacity>
        <IconSymbol name="arrow.up" size={20} color="#878A8C" />
      </TouchableOpacity>
      <Text style={styles.voteCount}>{post.upvotes}</Text>
      <TouchableOpacity>
        <IconSymbol name="arrow.down" size={20} color="#878A8C" />
      </TouchableOpacity>
    </View>

    {/* Right Column: Content */}
    <View style={styles.contentContainer}>
      {/* Post Info: Category, Anonymous/Actual Author, Time */}
      <View style={styles.postInfoContainer}>
        {/* Display category */}
        <Text style={styles.categoryText}>{post.category}</Text>

        {/* Promoted badge if applicable */}
        {post.isPromoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Sponsored</Text>
          </View>
        )}

        <Text style={styles.infoSeparator}>• Posted by</Text>

        {/* Display actual author or anonymous username */}
        {post.actualAuthor ? (
          <View style={styles.actualAuthorContainer}>
            {/* Could add a small profile image here */}
            <Text style={styles.verifiedAuthorText}>{post.actualAuthor.name}</Text>
            <View style={styles.verifiedBadge}>
              <IconSymbol name="checkmark.seal.fill" size={12} color="#007AFF" />
            </View>
          </View>
        ) : (
          <Text style={styles.authorText}>{post.anonymousAuthor}</Text>
        )}

        <Text style={styles.infoSeparator}>•</Text>
        <Text style={styles.timestampText}>{formatTimeAgo(post.timestamp)}</Text>
      </View>

      {/* Title */}
      <Text style={styles.titleText}>{post.title}</Text>

      {/* Professional title for verified posters */}
      {post.actualAuthor && post.actualAuthor.title && (
        <Text style={styles.professionalTitle}>{post.actualAuthor.title}</Text>
      )}

      {/* Content Snippet */}
      {post.contentSnippet && (
        <Text style={styles.snippetText} numberOfLines={post.isPromoted ? undefined : 3}>
          {post.contentSnippet}
        </Text>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="bubble.left.fill" size={16} color="#878A8C" />
          <Text style={styles.actionText}>{post.commentsCount} Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="square.and.arrow.up" size={16} color="#878A8C" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
// --- End Placeholder ---

export default function ForumScreen() {
  const router = useRouter();

  const navigateToNewPost = () => {
    // Keep navigation to new post screen (adjust route if necessary)
    router.push('/forum/new-post' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1" weight="bold" style={styles.headerTitle}>
          Community Feed
        </Text>
        {/* DM Button with Badge */}
        <TouchableOpacity
          style={styles.dmButtonContainer}
          onPress={() => router.push('/(tabs)/dm')}
        >
          <View style={styles.dmIconWrapper}>
            <IconSymbol name="message.fill" size={26} color="#007AFF" />
            {/* Badge View */}
            <View style={styles.dmBadge}>
              <Text style={styles.dmBadgeText}>0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockPosts}
        renderItem={({ item }) => <RedditPostCard post={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={navigateToNewPost}>
        <IconSymbol name="plus" size={24} color="#FFF" weight="semibold" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAE0E6', // Reddit-like light grey background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 50, // Adjust padding for status bar
    paddingBottom: 10,
    backgroundColor: '#FFF', // White header background
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  headerTitle: {
    fontSize: 28,
    color: '#1A1A1B',
    fontFamily: 'Poppins_700Bold',
  },
  dmButtonContainer: {
    // Style for the touchable area
    padding: 5,
  },
  dmIconWrapper: {
    // Wrapper for icon and badge positioning
    position: 'relative', // Needed for absolute positioning of the badge
  },
  dmBadge: {
    // Style for the notification badge
    position: 'absolute',
    top: -5, // Adjust position as needed
    right: -8, // Adjust position as needed
    backgroundColor: 'red',
    borderRadius: 10, // Make it circular
    minWidth: 20, // Ensure minimum size
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5, // Add some padding if number gets large
  },
  dmBadgeText: {
    // Style for the text inside the badge
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  postsList: {
    paddingVertical: 10,
    paddingBottom: 80, // Add padding to avoid overlap with FAB
  },
  // --- Styles for RedditPostCard (anonymous version) ---
  postCardContainer: {
    backgroundColor: '#FFF',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    flexDirection: 'row',
  },
  voteContainer: {
    width: 40,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1B',
    fontFamily: 'Poppins_700Bold',
    marginVertical: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  postInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap', // Allow wrapping if names are long
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1B',
    fontFamily: 'Poppins_700Bold',
  },
  infoSeparator: {
    marginHorizontal: 4,
    color: '#878A8C',
    fontSize: 12, // Match other info text size
    fontFamily: 'Poppins_400Regular',
  },
  authorText: {
    fontSize: 12,
    color: '#878A8C',
    marginHorizontal: 2, // Add slight space around author name
    fontFamily: 'Poppins_400Regular',
  },
  timestampText: {
    fontSize: 12,
    color: '#878A8C',
    fontFamily: 'Poppins_400Regular',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1B',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
  },
  snippetText: {
    fontSize: 14,
    color: '#1C1C1C',
    marginBottom: 10,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#878A8C',
    fontFamily: 'Poppins_700Bold',
  },
  fab: {
    // Styles for the Floating Action Button
    position: 'absolute',
    right: 20,
    bottom: 30, // Adjust as needed, consider tab bar height
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Example blue color
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  promotedPostContainer: {
    borderWidth: 1,
    borderColor: '#E0E7FF', // Light blue border
    backgroundColor: '#FAFBFF', // Very light blue background
    marginVertical: 8, // More spacing around promoted posts
    shadowColor: '#4A6FA5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  promotedBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  promotedText: {
    fontSize: 10,
    color: '#4A6FA5',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  actualAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedAuthorText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  professionalTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: -4,
    marginBottom: 8,
    fontStyle: 'italic',
    fontFamily: 'Poppins_400Regular',
  },
  // --- End Placeholder Styles ---
});
