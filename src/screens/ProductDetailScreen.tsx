import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { api } from '../services/api';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import {
  cartIcon,
  favouriteActiveIcon,
  favouriteInactiveIcon,
  leftArrowIcon,
  searchIcon,
} from '../assets';

type ProductDetailScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavoritesStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const [favoriteAction, setFavoriteAction] = useState<'added' | 'removed'>(
    'added',
  );

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await api.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setShowCartPopup(true);
      // Auto hide popup after 2 seconds
      setTimeout(() => {
        setShowCartPopup(false);
      }, 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      const wasInFavorites = checkIsFavorite(product.id);
      toggleFavorite(product);
      setFavoriteAction(wasInFavorites ? 'removed' : 'added');
      setShowFavoritePopup(true);
      // Auto hide popup after 2 seconds
      setTimeout(() => {
        setShowFavoritePopup(false);
      }, 2000);
    }
  };

  const isFavorite = product ? checkIsFavorite(product.id) : false;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={leftArrowIcon} style={styles.leftArrowIcon} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Product Detail</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Image source={searchIcon} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <Image source={cartIcon} style={styles.cartIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Image
                source={
                  isFavorite ? favouriteActiveIcon : favouriteInactiveIcon
                }
                style={styles.favouriteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.model}>
            Model: {product.category}, {product.id}
          </Text>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Cart Popup */}
      <Modal
        visible={showCartPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCartPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <Image source={cartIcon} style={styles.popupIcon} />
              <Text style={styles.popupTitle}>Added to Cart!</Text>
              <Text style={styles.popupMessage}>
                {product?.title} has been added to your cart.
              </Text>
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => setShowCartPopup(false)}
              >
                <Text style={styles.popupButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Favorite Popup */}
      <Modal
        visible={showFavoritePopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFavoritePopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <Image
                source={
                  favoriteAction === 'added'
                    ? favouriteActiveIcon
                    : favouriteInactiveIcon
                }
                style={styles.popupIcon}
              />
              <Text style={styles.popupTitle}>
                {favoriteAction === 'added'
                  ? 'Added to Favorites!'
                  : 'Removed from Favorites!'}
              </Text>
              <Text style={styles.popupMessage}>
                {product?.title} has been{' '}
                {favoriteAction === 'added' ? 'added to' : 'removed from'} your
                favorites.
              </Text>
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => setShowFavoritePopup(false)}
              >
                <Text style={styles.popupButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    fontWeight: '400',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#000000',
  },
  backButton: {
    padding: 5,
  },
  searchButton: {
    padding: 5,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f8f8f8',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 24,
    margin: 20,
  },
  productImage: {
    width: width * 0.7,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  favoriteButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  productInfo: {
    padding: 20,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 24,
  },
  model: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  cartButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#212429',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  searchIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#333',
  },
  cartIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  favouriteIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  leftArrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
  },
  // Popup styles
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    maxWidth: 320,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  popupContent: {
    padding: 24,
    alignItems: 'center',
  },
  popupIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  popupTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: '#212429',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    minWidth: 80,
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
