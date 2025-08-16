import React from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import { useAppContext } from '../context/AppContext';

// Import custom icons
import HomeIcon from '../assets/icons/HomeIcon.png';
import BrowseIcon from '../assets/icons/BrowseIcon.png';
import FavouritIcon from '../assets/icons/FavouritIcon.png';
import CartIcon from '../assets/icons/CartIcon.png';
import ProfileIcon from '../assets/icons/ProfileIcon.png';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListingScreen from '../screens/ProductListingScreen';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack
type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { getFavoritesCount } = useFavoritesStore();
  const { getCartItemsCount } = useCartStore();

  const favoritesCount = getFavoritesCount();
  const cartCount = getCartItemsCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          let iconSource;
          const iconStyle = {
            width: size,
            height: size,
            opacity: focused ? 1 : 0.4,
            tintColor: focused ? '#333' : '#C0C0C0',
          };

          if (route.name === 'Home') {
            iconSource = HomeIcon;
          } else if (route.name === 'Browse') {
            iconSource = BrowseIcon;
          } else if (route.name === 'Favourites') {
            iconSource = FavouritIcon;
          } else if (route.name === 'Cart') {
            iconSource = CartIcon;
          } else if (route.name === 'Profile') {
            iconSource = ProfileIcon;
          }

          return (
            <Image source={iconSource} style={iconStyle} resizeMode="contain" />
          );
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#C0C0C0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter',
          fontWeight: '500',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen
        name="Favourites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favourites',
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#333',
            color: '#fff',
            fontSize: 10,
            fontFamily: 'Inter',
            fontWeight: '600',
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#333',
            color: '#fff',
            fontSize: 10,
            fontFamily: 'Inter',
            fontWeight: '600',
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAppContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen
            name="ProductListing"
            component={ProductListingScreen}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
