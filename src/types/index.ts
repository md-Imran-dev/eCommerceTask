export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: number };
  ProductListing: { category: string };
};

export type MainTabParamList = {
  Home: undefined;
  Browse: undefined;
  Favourites: undefined;
  Cart: undefined;
  Profile: undefined;
}; 