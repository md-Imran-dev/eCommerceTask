import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useCartStore } from '../store/cartStore';
import { Product } from '../types';
import {
  amexIcon,
  applePayIcon,
  cartIcon,
  gPayIcon,
  mastercardIcon,
  paypalIcon,
  threeDotIcon,
  visaIcon,
} from '../assets';

interface CartItem {
  product: Product;
  quantity: number;
}

const CartScreen = () => {
  const { cartItems, updateQuantity, getCartTotal } = useCartStore();

  const paymentMethods = [
    { id: 'paypal', icon: paypalIcon, name: 'PayPal' },
    { id: 'visa', icon: visaIcon, name: 'Visa' },
    { id: 'mastercard', icon: mastercardIcon, name: 'Mastercard' },
    { id: 'gpay', icon: gPayIcon, name: 'Google Pay' },
    { id: 'applepay', icon: applePayIcon, name: 'Apple Pay' },
    { id: 'amex', icon: amexIcon, name: 'American Express' },
  ];

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'This is a demo checkout. Your order would be processed here.',
      [{ text: 'OK', onPress: () => {} }],
    );
  };

  const handlePaymentMethodPress = (method: (typeof paymentMethods)[0]) => {
    Alert.alert('Payment Method', `You selected ${method.name}`, [
      { text: 'OK', onPress: () => {} },
    ]);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productPriceContainer}>
          <Text style={styles.productPrice}>
            ${item.product.price.toFixed(2)}
          </Text>
          <Text style={styles.productOriginalPrice}>
            ${(item.product.price * 1.2).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.product.title}
        </Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {item.product.category}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.menuButton}>
          <Image source={threeDotIcon} style={styles.menuDots} />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, styles.minusButton]}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Text style={[styles.quantityButtonText, styles.minusButtonText]}>
              -
            </Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Shipping</Text>
          <Text style={styles.totalValue}>$0.00</Text>
        </View>
        <View style={styles.totalRow}>
          <View style={styles.totalLabelContainer}>
            <Text style={styles.totalLabelBold}>Total</Text>
            <Text style={styles.taxIncluded}>TVA included</Text>
          </View>
          <Text style={styles.totalValueBold}>
            ${getCartTotal().toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
        <View style={styles.paymentMethods}>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethodButton}
              onPress={() => handlePaymentMethodPress(method)}
            >
              <Image source={method.icon} style={styles.paymentIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Image source={cartIcon} style={styles.cartIcon} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>
            Add some products to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.product.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cartList}
          style={styles.flatListContainer}
        />

        {/* Fixed Footer at bottom */}
        {renderFooter()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  contentContainer: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter',
    color: '#666',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#999',
    marginTop: 4,
  },
  cartList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20, // Add padding to prevent overlap with footer
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  productImage: {
    width: 66,
    height: 66,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
  },
  menuButton: {},
  menuDots: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  minusButtonText: {
    color: '#333',
  },
  minusButton: {
    backgroundColor: '#F5F5F5',
  },
  quantity: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  totalSection: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  totalLabelBold: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  totalValueBold: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#000',
  },
  taxIncluded: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#999',
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  paymentMethodButton: {
    padding: 4,
    borderRadius: 8,
  },
  paymentIcon: {
    width: Platform.OS === 'android' ? 56 : 52,
    height: Platform.OS === 'android' ? 32 : 32,
    resizeMode: 'contain',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    padding: 3,
  },
  cartIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  checkoutContainer: {},
  totalLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default CartScreen;
