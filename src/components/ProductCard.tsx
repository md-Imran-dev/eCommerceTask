import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Product } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import { favouriteActiveIcon, favouriteInactiveIcon } from '../assets';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  variant?: 'default' | 'small';
}

const { width } = Dimensions.get('window');

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'default',
}) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isProductFavorite = isFavorite(product.id);

  const cardWidth = variant === 'small' ? width * 0.42 : width * 0.45;

  const handleFavoritePress = () => {
    toggleFavorite(product);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress(product)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Image
            source={
              isProductFavorite ? favouriteActiveIcon : favouriteInactiveIcon
            }
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.category === 'electronics'
            ? 'SONY Premium Wireless Headphones'
            : product.title}
        </Text>
        <Text style={styles.model}>
          Model:{' '}
          {product.category === 'electronics'
            ? 'WH-1000XM4, Black'
            : `${product.category}, ${product.id}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 18,
  },
  model: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#8E8E8E',
  },
  favoriteIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
});

export default ProductCard;
