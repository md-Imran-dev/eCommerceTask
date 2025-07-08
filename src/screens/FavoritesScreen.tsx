import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useFavoritesStore } from '../store/favoritesStore';

type FavoritesScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, clearFavorites } = useFavoritesStore();

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleClearFavorites = () => {
    clearFavorites();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" size={80} color="#E5E5E5" />
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
        <Text style={styles.title}>Favorites</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClearFavorites}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <Text style={styles.countText}>
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
          </Text>
          <FlatList
            data={favorites}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            columnWrapperStyle={styles.row}
          />
        </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  countText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E8E',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  productsList: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FavoritesScreen;
