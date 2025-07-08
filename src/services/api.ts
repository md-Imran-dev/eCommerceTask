import { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

export const api = {

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const categories = await response.json();
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },
}; 