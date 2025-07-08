import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type BrowseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

const BrowseScreen = () => {
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');

  const categories: CategoryItem[] = [
    { id: 'electronics', name: 'Audio', icon: 'headset' },
    { id: 'electronics', name: 'Drones + Electronics', icon: 'camera' },
    { id: 'electronics', name: 'Photo + Video', icon: 'photo-camera' },
    { id: 'electronics', name: 'Gaming + VR', icon: 'games' },
    { id: 'electronics', name: 'Networking', icon: 'wifi' },
    { id: 'electronics', name: 'Notebooks + PCs', icon: 'computer' },
    { id: 'electronics', name: 'PC components', icon: 'memory' },
    { id: 'electronics', name: 'Peripherals', icon: 'mouse' },
    { id: 'electronics', name: 'Smartphones + Tablets', icon: 'smartphone' },
    { id: 'electronics', name: 'Software solutions', icon: 'apps' },
    { id: 'electronics', name: 'TV + Home cinema', icon: 'tv' },
  ];

  const renderCategory = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate('ProductListing', { category: item.id })
      }
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryText}>{item.name}</Text>
        <Icon name="chevron-right" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default BrowseScreen;
