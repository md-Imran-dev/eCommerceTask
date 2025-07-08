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
        console.log('🏪 CategoryStore: fetchCategories called');
        const state = get();
        const now = Date.now();
        
        console.log('🏪 CategoryStore: Current state:', {
          categories: state.categories,
          isLoading: state.isLoading,
          error: state.error,
          lastFetchTime: state.lastFetchTime,
        });
        
        // Check network connectivity first
        console.log('🏪 CategoryStore: Checking network connectivity...');
        const netInfo = await NetInfo.fetch();
        console.log('🏪 CategoryStore: Network info:', {
          isConnected: netInfo.isConnected,
          isInternetReachable: netInfo.isInternetReachable,
          type: netInfo.type,
        });
        
        if (!netInfo.isConnected) {
          const errorMessage = 'No internet connection';
          console.error('❌ CategoryStore: Network error:', errorMessage);
          set({ isLoading: false, error: errorMessage });
          return;
        }
        
        // Check if we have cached data that's still valid
        if (
          state.categories.length > 0 &&
          state.lastFetchTime &&
          now - state.lastFetchTime < CACHE_DURATION
        ) {
          console.log('📦 CategoryStore: Using cached categories:', state.categories);
          return;
        }

        console.log('🔄 CategoryStore: Setting loading state to true');
        set({ isLoading: true, error: null });

        try {
          console.log('🚀 CategoryStore: Calling api.getCategories()');
          const categories = await api.getCategories();
          
          console.log('🎉 CategoryStore: API call successful, received categories:', categories);
          console.log('🔢 CategoryStore: Categories count:', categories.length);
          
          set({
            categories,
            isLoading: false,
            error: null,
            lastFetchTime: now,
          });
          
          console.log('✅ CategoryStore: State updated successfully');
        } catch (error) {
          console.error('❌ CategoryStore: API call failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
          console.error('❌ CategoryStore: Error message:', errorMessage);
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          console.log('💥 CategoryStore: Error state set');
        }
      },

      clearError: () => {
        console.log('🧹 CategoryStore: Clearing error');
        set({ error: null });
      },
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