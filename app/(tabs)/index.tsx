import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/core/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Card {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export default function HomeScreen() {
  const router = useRouter();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const moreWaysCards = [
    {
      id: '1',
      title: 'Find jobs →',
      description: 'Discover career opportunities in the US',
      image: require('@/assets/images/interview image.png'),
    },
    {
      id: '2',
      title: 'Latest updates →',
      description: 'Stay informed with international student news',
      image: require('@/assets/images/news image.png'),
    },
  ];

  const travelCards = [
    {
      id: '1',
      title: 'University adjustment →',
      description: 'Get help adapting to US university life',
      image: require('@/assets/images/university image.png'),
    },
    {
      id: '2',
      title: 'Other services →',
      description: 'Explore additional student support services',
      image: require('@/assets/images/services.png'),
    },
  ];

  const renderCard = ({ item }: { item: Card }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi, Rory</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.locationText}>Washington, DC</Text>
        </View>

        {/* Business Hub Banner */}
        <TouchableOpacity style={styles.businessHubBanner} onPress={() => router.push('/roadmap')}>
          <View style={styles.businessHubContent}>
            <View style={styles.businessHubText}>
              <Text style={styles.businessHubTitle}>Explore your transition steps</Text>
              <View style={styles.viewPerksContainer}>
                <Text style={styles.viewPerksText}>View roadmap</Text>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </View>
            <Image
              source={require('@/assets/images/reminder image.png')}
              style={styles.businessHubImage}
            />
          </View>
        </TouchableOpacity>

        {/* More Ways Section */}
        <View style={styles.moreWaysSection}>
          <Text style={styles.moreWaysTitle}>More ways to use TransitionU</Text>
          <FlatList
            data={moreWaysCards}
            renderItem={renderCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            keyExtractor={item => item.id}
          />
        </View>

        {/* Travel Section */}
        <View style={styles.travelSection}>
          <Text style={styles.travelTitle}>Study internationally made easy</Text>
          <FlatList
            data={travelCards}
            renderItem={renderCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            keyExtractor={item => item.id}
          />
        </View>
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
  welcomeContainer: {
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  dateText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 18,
    color: '#000',
  },
  businessHubBanner: {
    backgroundColor: '#1a73e8',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 140,
    width: 'auto',
  },
  businessHubContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  businessHubText: {
    flex: 1,
    paddingRight: 120,
  },
  businessHubTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  viewPerksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewPerksText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 4,
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 16,
  },
  businessHubImage: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
    position: 'absolute',
    right: -20,
    top: -20,
  },
  moreWaysSection: {
    padding: 16,
  },
  moreWaysTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  cardDescription: {
    fontSize: 16,
    color: '#000',
  },
  travelSection: {
    padding: 16,
  },
  travelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  travelCardsContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 16,
  },
});
