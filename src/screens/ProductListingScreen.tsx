import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCategoryStore } from '../store/categoryStore';

type ProductListingScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
type ProductListingScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductListing'
>;

const ProductListingScreen = () => {
  const navigation = useNavigation<ProductListingScreenNavigationProp>();
  const route = useRoute<ProductListingScreenRouteProp>();
  const { category } = route.params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Relevance');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await api.getProductsByCategory(selectedCategory);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleSortSelect = (sortOption: string) => {
    setSortBy(sortOption);
    setShowSortModal(false);
    // Apply sorting logic here
    const sortedProducts = [...products];
    switch (sortOption) {
      case 'Price: Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        sortedProducts.sort(
          (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0),
        );
        break;
      default:
        // Keep original order for 'Relevance'
        break;
    }
    setProducts(sortedProducts);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  const sortOptions = [
    'Relevance',
    'Price: Low to High',
    'Price: High to Low',
    'Rating',
  ];

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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {getCategoryDisplayName(selectedCategory)}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Icon name="tune" size={20} color="#666" />
          <Text style={styles.filterText}>Category</Text>
          <Icon name="keyboard-arrow-down" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Brand</Text>
          <Icon name="keyboard-arrow-down" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Price</Text>
          <Icon name="keyboard-arrow-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Results count and sort */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{products.length} products</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortText}>Sort by {sortBy}</Text>
          <Icon name="keyboard-arrow-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.row}
      />

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.modalOption,
                    selectedCategory === category && styles.selectedOption,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedCategory === category &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {getCategoryDisplayName(category)}
                  </Text>
                  {selectedCategory === category && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalOption,
                    sortBy === option && styles.selectedOption,
                  ]}
                  onPress={() => handleSortSelect(option)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      sortBy === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                  {sortBy === option && (
                    <Icon name="check" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 5,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultsCount: {
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  productsList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ProductListingScreen;
