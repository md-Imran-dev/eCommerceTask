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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCategoryStore } from '../store/categoryStore';
import {
  leftArrowIcon,
  searchIcon,
  filterIcon,
  downArrowIcon,
  clickedIcon,
  closeIcon,
} from '../assets';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Relevance');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedBrand, selectedPriceRange]);

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

  const applyFilters = () => {
    let filtered = [...products];

    // Apply brand filter (simplified - you can implement proper brand filtering)
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase().includes(selectedBrand.toLowerCase()),
      );
    }

    // Apply price range filter
    if (selectedPriceRange !== 'All') {
      switch (selectedPriceRange) {
        case 'Under $50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '$50 - $100':
          filtered = filtered.filter(
            product => product.price >= 50 && product.price <= 100,
          );
          break;
        case '$100 - $200':
          filtered = filtered.filter(
            product => product.price >= 100 && product.price <= 200,
          );
          break;
        case 'Over $200':
          filtered = filtered.filter(product => product.price > 200);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setShowBrandModal(false);
  };

  const handlePriceSelect = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    setShowPriceModal(false);
  };

  const handleSortSelect = (sortOption: string) => {
    setSortBy(sortOption);
    setShowSortModal(false);
    // Apply sorting logic here
    const sortedProducts = [...filteredProducts];
    switch (sortOption) {
      case 'Price: Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order for 'Relevance'
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low'];

  const brandOptions = ['All', 'SONY', 'Apple', 'Samsung', 'Generic'];

  const priceOptions = [
    'All',
    'Under $50',
    '$50 - $100',
    '$100 - $200',
    'Over $200',
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
          <Image source={leftArrowIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {getCategoryDisplayName(selectedCategory)}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Image source={searchIcon} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Image source={filterIcon} style={styles.filterIconStyle} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.filterText}>Category</Text>
          <Image source={downArrowIcon} style={styles.downArrowStyle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowBrandModal(true)}
        >
          <Text style={styles.filterText}>
            {selectedBrand === 'All' ? 'Brand' : selectedBrand}
          </Text>
          <Image source={downArrowIcon} style={styles.downArrowStyle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowPriceModal(true)}
        >
          <Text style={styles.filterText}>
            {selectedPriceRange === 'All' ? 'Price' : selectedPriceRange}
          </Text>
          <Image source={downArrowIcon} style={styles.downArrowStyle} />
        </TouchableOpacity>
      </View>

      {/* Results count and sort */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProducts.length.toLocaleString()} products
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortText}>
            Sort by <Text style={styles.sortTextBold}>{sortBy}</Text>
          </Text>
          <Image source={downArrowIcon} style={styles.downArrowStyle} />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
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
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.modalOption}
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
                    <Image source={clickedIcon} style={styles.clickedIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Brand Modal */}
      <Modal
        visible={showBrandModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBrandModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Brand</Text>
              <TouchableOpacity onPress={() => setShowBrandModal(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {brandOptions.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={styles.modalOption}
                  onPress={() => handleBrandSelect(brand)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedBrand === brand && styles.selectedOptionText,
                    ]}
                  >
                    {brand}
                  </Text>
                  {selectedBrand === brand && (
                    <Image source={clickedIcon} style={styles.clickedIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Price Modal */}
      <Modal
        visible={showPriceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Price Range</Text>
              <TouchableOpacity onPress={() => setShowPriceModal(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {priceOptions.map(price => (
                <TouchableOpacity
                  key={price}
                  style={styles.modalOption}
                  onPress={() => handlePriceSelect(price)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedPriceRange === price && styles.selectedOptionText,
                    ]}
                  >
                    {price}
                  </Text>
                  {selectedPriceRange === price && (
                    <Image source={clickedIcon} style={styles.clickedIcon} />
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
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {sortOptions.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalOption,
                    index === sortOptions.length - 1 && styles.lastModalOption,
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
                    <Image source={clickedIcon} style={styles.clickedIcon} />
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
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 5,
  },
  headerIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginHorizontal: 5,
  },
  filterIconStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 40,
    fontWeight: '400',
    color: '#666',
  },
  downArrowStyle: {
    width: 12,
    height: 12,
    marginLeft: 4,
    tintColor: '#666',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#8E8E8E',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#000000',
    marginRight: 5,
  },
  sortTextBold: {
    fontWeight: 'bold',
  },
  productsList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastModalOption: {
    borderBottomWidth: 0,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  clickedIcon: {
    width: 14,
    height: 10,
    marginRight: 10,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
});

export default ProductListingScreen;
