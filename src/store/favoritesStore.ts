import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface FavoritesState {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product: Product) => {
        const currentFavorites = get().favorites;
        const existingIndex = currentFavorites.findIndex(fav => fav.id === product.id);
        
        if (existingIndex !== -1) {
          // Remove from favorites
          const newFavorites = currentFavorites.filter(fav => fav.id !== product.id);
          set({ favorites: newFavorites });
          console.log('Removed from favorites:', product.title);
        } else {
          // Add to favorites
          const newFavorites = [...currentFavorites, product];
          set({ favorites: newFavorites });
          console.log('Added to favorites:', product.title);
        }
      },

      isFavorite: (productId: number) => {
        const currentFavorites = get().favorites;
        return currentFavorites.some(fav => fav.id === productId);
      },

      getFavoritesCount: () => {
        const currentFavorites = get().favorites;
        return currentFavorites.length;
      },

      clearFavorites: () => {
        set({ favorites: [] });
        console.log('All favorites cleared');
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 