import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Colors } from './style';

const { brand, darkLight, secondary, tertiary, border } = Colors;

/**
 * Global top header that persists across the main app screens.
 *
 * Layout:
 * - Left: Logo + title + device name
 * - Right: Circular profile avatar
 */
const HeaderCard = ({ style }) => {
  const { user } = useAuth();
  const { activeDevice } = useDashboard();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.name?.[0]?.toUpperCase() || '';
    const last = user.surname?.[0]?.toUpperCase() || '';
    return first + last || 'U';
  };

  // Get laptop name
  const laptopName = activeDevice?.name || 'No device registered';

  return (
    <View style={[styles.container, style]}>
      {/* Left Side - Logo and Text */}
      <View style={styles.leftSection}>
        {/* Logo */}
        <Image
          source={require('../image/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.appName}>PC-Doctor AI</Text>
          <Text style={styles.laptopName} numberOfLines={1}>
            {laptopName}
          </Text>
        </View>
      </View>

      {/* Right Side - Profile Picture */}
      <View style={styles.rightSection}>
        <View style={styles.avatarContainer}>
          {user?.profile_image ? (
            <Image
              source={{ uri: user.profile_image }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{getUserInitials()}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: secondary,
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: tertiary,
    marginBottom: 2,
  },
  laptopName: {
    fontSize: 12,
    color: darkLight,
    fontWeight: '500',
  },
  rightSection: {
    marginLeft: 12,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: brand,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HeaderCard;