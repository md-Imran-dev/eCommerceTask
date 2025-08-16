import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AppContextType {
  cartItems: CartItem[];
  favorites: Product[];
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleFavorite: (product: Product) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { id: Date.now(), product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === product.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would call an API here
      // For now, we'll simulate a login with simple validation
      if (email && password.length >= 6) {
        const userData: User = {
          id: Date.now().toString(),
          email,
          firstName: email.split('@')[0],
          lastName: 'User',
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('isAuthenticated', 'true');

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      // In a real app, you would call an API here
      // For now, we'll simulate a signup with simple validation
      if (firstName && lastName && email && password.length >= 6) {
        const userData: User = {
          id: Date.now().toString(),
          email,
          firstName,
          lastName,
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('isAuthenticated', 'true');

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isAuthenticated');
      setUser(null);
      setIsAuthenticated(false);
      setCartItems([]);
      setFavorites([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuth = await AsyncStorage.getItem('isAuthenticated');
        const userData = await AsyncStorage.getItem('user');

        if (isAuth === 'true' && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AppContext.Provider
      value={{
        cartItems,
        favorites,
        isAuthenticated,
        user,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleFavorite,
        getCartTotal,
        getCartItemCount,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
