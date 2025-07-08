import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { api } from '../services/api';
import { useCategoryStore } from '../store/categoryStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const {
    categories,
    fetchCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoryStore();

  useEffect(() => {
    console.log('🏠 HomeScreen mounted');
    console.log('🏠 Categories from store:', categories);
    console.log('🏠 Categories loading:', categoriesLoading);
    console.log('🏠 Categories error:', categoriesError);

    // Test basic network connectivity
    const testNetwork = async () => {
      try {
        console.log('🌐 Testing basic network connectivity...');
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts/1',
        );
        console.log('🌐 Network test response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('🌐 Network test successful:', data.title);
        }
      } catch (error) {
        console.error('🌐 Network test failed:', error);
      }
    };

    testNetwork();
    fetchProducts();
    fetchCategories();
  }, [fetchCategories]);

  // Log whenever categories change
  useEffect(() => {
    console.log('🏠 Categories updated:', categories);
  }, [categories]);

  const fetchProducts = async () => {
    try {
      console.log('🏠 Fetching products...');
      const productsData = await api.getProducts();
      console.log('🏠 Products fetched:', productsData.length, 'items');

      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        console.warn('🏠 API returned non-array data:', productsData);
        setProducts([]);
      }
    } catch (error) {
      console.error('🏠 Error fetching products:', error);
      Alert.alert(
        'Error',
        'Failed to load products. Please check your internet connection.',
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const electronicsProducts = products.filter(
    p => p.category === 'electronics',
  );
  const recommendedProducts = products.slice(0, 4);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      navigation.navigate('ProductListing', {
        category: category,
      });
    }
  };

  // Display name mapping for FakeStore API categories
  const getCategoryDisplayName = (category: string): string => {
    const nameMap: { [key: string]: string } = {
      electronics: 'Electronics',
      jewelery: 'Jewelry',
      "men's clothing": "Men's Clothing",
      "women's clothing": "Women's Clothing",
    };
    return (
      nameMap[category.toLowerCase()] ||
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  };

  const renderDealItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.dealCard}
      onPress={() => handleProductPress(item)}
    >
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="favorite-border" size={20} color="#333" />
      </TouchableOpacity>
      <Image
        source={{ uri: item.image }}
        style={styles.dealImage}
        resizeMode="contain"
      />
      <View style={styles.dealInfo}>
        <Text style={styles.dealCategory}>Electronics</Text>
        <Text style={styles.dealPrice}>
          ${item.price.toFixed(2)}{' '}
          <Text style={styles.dealOriginalPrice}>
            ${(item.price * 1.5).toFixed(2)}
          </Text>
        </Text>
        <Text style={styles.dealTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.recommendedCard}
      onPress={() => handleProductPress(item)}
    >
      <TouchableOpacity style={styles.favoriteButton}>
        <Icon name="favorite-border" size={20} color="#333" />
      </TouchableOpacity>
      <Image
        source={{ uri: item.image }}
        style={styles.recommendedImage}
        resizeMode="contain"
      />
      <Text style={styles.recommendedPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.recommendedTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.recommendedCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  // Create category tabs with "All" first, then dynamic categories
  const categoryTabs = ['All', ...categories.slice(0, 4)]; // Show first 4 categories

  console.log('🏠 Rendering with categoryTabs:', categoryTabs);
  console.log('🏠 Products count:', products.length);
  console.log('🏠 Electronics products:', electronicsProducts.length);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Michael</Text>
        </View>

        {/* Debug Info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Categories: {categories.length} | Loading:{' '}
            {categoriesLoading.toString()} | Error: {categoriesError || 'None'}
          </Text>
          <Text style={styles.debugText}>
            Products: {products.length} | Loading: {loading.toString()}
          </Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabsContainer}
        >
          {categoryTabs.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.activeTab,
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.activeTabText,
                ]}
              >
                {category === 'All' ? 'All' : getCategoryDisplayName(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deals of the day */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deals of the day</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {!loading && electronicsProducts.length > 0 && (
            <>
              <FlatList
                data={electronicsProducts}
                renderItem={renderDealItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (width - 40),
                  );
                  setCurrentDealIndex(newIndex);
                }}
              />
              <View style={styles.pagination}>
                {electronicsProducts.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentDealIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </>
          )}

          {!loading && electronicsProducts.length === 0 && (
            <Text style={styles.noDataText}>
              No electronics products available
            </Text>
          )}

          {loading && (
            <Text style={styles.loadingText}>Loading products...</Text>
          )}
        </View>

        {/* Recommended for you */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          {!loading && recommendedProducts.length > 0 && (
            <FlatList
              data={recommendedProducts}
              renderItem={renderRecommendedItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.recommendedRow}
            />
          )}

          {!loading && recommendedProducts.length === 0 && (
            <Text style={styles.noDataText}>
              No recommended products available
            </Text>
          )}

          {loading && (
            <Text style={styles.loadingText}>Loading recommendations...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  debugInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  categoryTabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
  },
  dealCard: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  dealImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  dealInfo: {
    flex: 1,
  },
  dealCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dealOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recommendedCategory: {
    fontSize: 12,
    color: '#666',
  },
  recommendedRow: {
    justifyContent: 'space-between',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default HomeScreen;
