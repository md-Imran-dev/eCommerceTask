import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';

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
          <Icon
            name={isProductFavorite ? 'favorite' : 'favorite-border'}
            size={20}
            color={isProductFavorite ? '#FF6B6B' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.brand}>
          {product.category === 'electronics' ? 'SONY' : 'Brand'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    margin: 6,
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 36,
  },
  brand: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E8E',
    textTransform: 'uppercase',
  },
});

export default ProductCard;
