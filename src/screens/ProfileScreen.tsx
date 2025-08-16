import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { rightArrowIcon } from '../assets';
import { useAppContext } from '../context/AppContext';

const ProfileScreen = () => {
  const menuItems = [
    { id: 1, title: 'Order History', icon: 'history' },
    { id: 2, title: 'Shipping Address', icon: 'location-on' },
    { id: 3, title: 'Payment Methods', icon: 'credit-card' },
    { id: 4, title: 'Notifications', icon: 'notifications' },
    { id: 6, title: 'Help & Support', icon: 'help' },
    { id: 7, title: 'About', icon: 'info' },
    { id: 8, title: 'Sign Out', icon: 'exit-to-app' },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Image source={rightArrowIcon} style={styles.menuItemIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Image
              source={{
                uri: 'https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg',
              }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Michael Johnson</Text>
            <Text style={styles.userEmail}>michael.johnson@email.com</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text>EDIT</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>{menuItems.map(renderMenuItem)}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  profileSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#333',
    marginLeft: 15,
  },
  menuItemIcon: {
    width: 8,
    height: 14,
    resizeMode: 'contain',
  },
});

export default ProfileScreen;
