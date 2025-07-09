import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (product: Product, quantity = 1) => {
        const currentItems = get().cartItems;
        const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const newItems = [...currentItems];
          newItems[existingItemIndex].quantity += quantity;
          set({ cartItems: newItems });
        } else {
          // Add new item
          const newItems = [...currentItems, { product, quantity }];
          set({ cartItems: newItems });
        }
      },

      removeFromCart: (productId: number) => {
        const currentItems = get().cartItems;
        const newItems = currentItems.filter(item => item.product.id !== productId);
        set({ cartItems: newItems });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const currentItems = get().cartItems;
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          get().removeFromCart(productId);
          return;
        }
        
        const newItems = currentItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        set({ cartItems: newItems });
      },

      getCartItemsCount: () => {
        const currentItems = get().cartItems;
        return currentItems.length; 
      },

      getCartTotal: () => {
        const currentItems = get().cartItems;
        return currentItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      isInCart: (productId: number) => {
        const currentItems = get().cartItems;
        return currentItems.some(item => item.product.id === productId);
      },

      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 