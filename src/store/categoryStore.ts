import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { api } from '../services/api';

interface CategoryState {
  categories: string[];
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

// Cache duration: 1 hour (3600000 ms)
const CACHE_DURATION = 3600000;

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoading: false,
      error: null,
      lastFetchTime: null,

      fetchCategories: async () => {
        const state = get();
        const now = Date.now();
        
        // Check network connectivity first
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          const errorMessage = 'No internet connection';
          console.error('CategoryStore: Network error:', errorMessage);
          set({ isLoading: false, error: errorMessage });
          return;
        }
        
        // Check if we have cached data that's still valid
        if (
          state.categories.length > 0 &&
          state.lastFetchTime &&
          now - state.lastFetchTime < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const categories = await api.getCategories();
          
          set({
            categories,
            isLoading: false,
            error: null,
            lastFetchTime: now,
          });
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist categories and lastFetchTime, not loading/error states
      partialize: (state) => ({
        categories: state.categories,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
); 