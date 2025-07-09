import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import { cartIcon, threeDotIcon } from '../assets';

type FavoritesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, clearFavorites } = useFavoritesStore();
  const { addToCart } = useCartStore();

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [{ text: 'OK', onPress: () => {} }],
    );
  };

  const handleMenuPress = (product: Product) => {
    Alert.alert('Options', `What would you like to do with ${product.title}?`, [
      {
        text: 'Remove from Favorites',
        onPress: () => handleRemoveFromFavorites(product),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleRemoveFromFavorites = (product: Product) => {
    const { toggleFavorite } = useFavoritesStore.getState();
    toggleFavorite(product);
    Alert.alert(
      'Removed from Favorites',
      `${product.title} has been removed from your favorites.`,
      [{ text: 'OK', onPress: () => {} }],
    );
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.productOriginalPrice}>
            ${(item.price * 1.2).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Image source={cartIcon} style={styles.cartButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenuPress(item)}>
          <Image source={threeDotIcon} style={styles.menuDots} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={cartIcon} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyDescription}>
        Products you mark as favorites will appear here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.favoritesList}
        />
      )}
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
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  favoritesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 72,
    height: 76,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    resizeMode: 'contain',
    padding: 5,
  },
  productInfo: {
    flex: 1,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 2,
  },
  productOriginalPrice: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    width: '90%',
  },
  productDescription: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    height: 72,
  },
  menuDots: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: '#E5E5E5',
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#8E8E8E',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FavoritesScreen;
