import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useCategoryStore } from '../store/categoryStore';

type BrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

// Icon mapping for FakeStore API categories
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    electronics: 'devices',
    jewelery: 'diamond',
    "men's clothing": 'checkroom',
    "women's clothing": 'woman',
    // Fallback icons for other categories
    clothing: 'checkroom',
    accessories: 'watch',
    books: 'book',
    home: 'home',
    sports: 'sports',
  };

  return iconMap[category.toLowerCase()] || 'category';
};

const BrowseScreen = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, isLoading, error, fetchCategories, clearError } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', `Failed to load categories: ${error}`, [
        {
          text: 'Retry',
          onPress: () => {
            clearError();
            fetchCategories();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }, [error, clearError, fetchCategories]);

  const transformCategoriesToItems = (categories: string[]): CategoryItem[] => {
    return categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      icon: getCategoryIcon(category),
    }));
  };

  const filteredCategories = transformCategoriesToItems(categories).filter(
    category => category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCategoryPress = (category: CategoryItem) => {
    navigation.navigate('ProductListing', {
      category: category.id,
    });
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIcon}>
        <Icon name={item.icon} size={30} color="#007AFF" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading && categories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Categories</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Categories</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        style={styles.categoryList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No categories found' : 'No categories available'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  clearError();
                  fetchCategories();
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  categoryList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BrowseScreen;
