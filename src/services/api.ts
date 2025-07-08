import { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

export const api = {

  async getProducts(): Promise<Product[]> {
    try {
      console.log('🔄 API: Fetching products from', `${BASE_URL}/products`);
      const response = await fetch(`${BASE_URL}/products`);
      console.log('📡 API: Products response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ API: Products data received:', data.length, 'items');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ API: Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(id: number): Promise<Product> {
    try {
      console.log('🔄 API: Fetching product', id);
      const response = await fetch(`${BASE_URL}/products/${id}`);
      console.log('📡 API: Product response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ API: Product data received:', data.title);
      return data;
    } catch (error) {
      console.error('❌ API: Error fetching product:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      console.log('🔄 API: Fetching categories from', `${BASE_URL}/products/categories`);
      const response = await fetch(`${BASE_URL}/products/categories`);
      console.log('📡 API: Categories response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const categories = await response.json();
      console.log('✅ API: Categories data received:', categories);
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      console.error('❌ API: Error fetching categories:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      console.log('🔄 API: Fetching products by category:', category);
      const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
      console.log('📡 API: Products by category response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ API: Products by category data received:', data.length, 'items');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ API: Error fetching products by category:', error);
      throw error;
    }
  },
}; 