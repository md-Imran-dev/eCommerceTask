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
import ProductCard from '../components/ProductCard';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await api.getProducts();
      // Add safety check to ensure productsData is an array
      if (Array.isArray(productsData)) {
        setProducts(productsData.slice(0, 6)); // Show first 6 products
      } else {
        console.warn('API returned non-array data:', productsData);
        setProducts([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'electronics', name: 'Audio', icon: 'headset' },
    { id: 'electronics', name: 'Drones +\nElectronics', icon: 'camera' },
    { id: 'electronics', name: 'Photo +\nVideo', icon: 'photo-camera' },
    { id: 'electronics', name: 'Gaming +\nVR', icon: 'games' },
    { id: 'electronics', name: 'Networking', icon: 'wifi' },
    { id: 'electronics', name: 'Notebooks +\nPCs', icon: 'computer' },
  ];

  const dealProduct = products.find(p => p.category === 'electronics');

  const renderCategory = ({
    item,
  }: {
    item: { id: string; name: string; icon: string };
  }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate('ProductListing', { category: item.id })
      }
    >
      <View style={styles.categoryIcon}>
        <Icon name={item.icon} size={24} color="#666" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello Michael</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          <TouchableOpacity style={[styles.categoryTab, styles.activeTab]}>
            <Text style={[styles.categoryTabText, styles.activeTabText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Drones + Electronics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryTab}>
            <Text style={styles.categoryTabText}>Photo +</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.name}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Deals of the day */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deals of the day</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {dealProduct && (
            <TouchableOpacity
              style={styles.dealCard}
              onPress={() => handleProductPress(dealProduct)}
            >
              <View style={styles.dealContent}>
                <View style={styles.dealInfo}>
                  <Text style={styles.dealCategory}>
                    {dealProduct.category}
                  </Text>
                  <Text style={styles.dealPrice}>${dealProduct.price}</Text>
                  <Text style={styles.dealOriginalPrice}>
                    ${(dealProduct.price * 1.3).toFixed(2)}
                  </Text>
                  <Text style={styles.dealTitle}>{dealProduct.title}</Text>
                </View>
                <Image
                  source={{ uri: dealProduct.image }}
                  style={styles.dealImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Recommended for you */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <View style={styles.recommendedGrid}>
            {loading ? (
              <Text style={styles.loadingText}>Loading products...</Text>
            ) : (
              products
                .slice(0, 4)
                .map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={handleProductPress}
                    variant="small"
                  />
                ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  categoryTabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
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
    color: '#007AFF',
    fontSize: 14,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    paddingVertical: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealInfo: {
    flex: 1,
  },
  dealCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  dealOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 8,
  },
  dealTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  dealImage: {
    width: 80,
    height: 80,
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
