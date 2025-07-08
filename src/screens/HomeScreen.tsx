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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { api } from '../services/api';
import { useCategoryStore } from '../store/categoryStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { favouriteActiveIcon, favouriteInactiveIcon } from '../assets';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { categories, fetchCategories } = useCategoryStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = async () => {
    try {
      const productsData = await api.getProducts();
      if (Array.isArray(productsData)) {
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(
      product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  };

  const filteredProducts = getFilteredProducts();
  const dealsProducts = filteredProducts.slice(0, 10); // Show more products for deals
  const recommendedProducts = filteredProducts.slice(0, 4);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    setCurrentDealIndex(0); // Reset carousel index when category changes
  };

  const handleFavoritePress = (product: Product) => {
    toggleFavorite(product);
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
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleFavoritePress(item)}
      >
        <Image
          source={
            isFavorite(item.id) ? favouriteActiveIcon : favouriteInactiveIcon
          }
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.dealImage}
        resizeMode="contain"
      />

      <View style={styles.dealInfo}>
        <Text style={styles.dealCategory}>{item.category}</Text>
        <Text style={styles.dealPrice}>
          ${item.price.toFixed(2)}
          <Text style={styles.dealOriginalPrice}>
            {' $'}
            {(item.price * 1.3).toFixed(2)}
          </Text>
        </Text>
        <Text style={styles.dealTitle} numberOfLines={2}>
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
      <TouchableOpacity
        style={styles.favoriteButtonSmall}
        onPress={() => handleFavoritePress(item)}
      >
        <Image
          source={
            isFavorite(item.id) ? favouriteActiveIcon : favouriteInactiveIcon
          }
          style={styles.favoriteIcon}
        />
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
      <Text style={styles.recommendedBrand}>
        {item.category === 'electronics' ? 'SONY' : 'Brand'}
      </Text>
    </TouchableOpacity>
  );

  // Create category tabs with "All" first, then dynamic categories
  const categoryTabs = ['All', ...categories.slice(0, 4)];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Michael</Text>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabsContainer}
        >
          {categoryTabs.map(category => (
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

          {!loading && dealsProducts.length > 0 && (
            <>
              <FlatList
                data={dealsProducts}
                renderItem={renderDealItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.dealsContainer}
                onMomentumScrollEnd={event => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (width - 40),
                  );
                  setCurrentDealIndex(newIndex);
                }}
              />
              <View style={styles.pagination}>
                {dealsProducts.map((_, index) => (
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
              style={styles.recommendedContainer}
            />
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
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  categoryTabsContainer: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  categoryTab: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    marginRight: 32,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1A1A1A',
  },
  categoryTabText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E8E',
  },
  activeTabText: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E8E',
  },
  dealsContainer: {
    paddingLeft: 20,
  },
  dealCard: {
    width: width - 40,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  dealImage: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    alignSelf: 'center',
  },
  dealInfo: {
    alignItems: 'flex-start',
  },
  dealCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E8E',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  dealOriginalPrice: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 22,
  },
  dealDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E8E',
    lineHeight: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#1A1A1A',
    width: 24,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 12,
    position: 'relative',
  },
  favoriteButtonSmall: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    marginBottom: 12,
    alignSelf: 'center',
  },
  recommendedPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36,
  },
  recommendedBrand: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E8E',
    textTransform: 'uppercase',
  },
  recommendedRow: {
    justifyContent: 'space-between',
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
});

export default HomeScreen;
