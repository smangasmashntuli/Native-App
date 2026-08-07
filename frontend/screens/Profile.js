import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle, StyledButton, ButtonText } from '../components/style';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/apiService';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import HeaderCard from '../components/HeaderCard';

const { brand, tertiary, darkLight } = Colors;

const Profile = () => {
  const { user, logout } = useAuth();
  const {
    laptopSetup,
    laptopSpecs,
    notifications,
    unreadCount,
    experienceLevel,
    setExperienceLevel,
    loadingLaptop,
    laptopError,
    loadLaptopData,
    loadNotifications,
  } = useDashboard();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLaptopData();
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadLaptopData(), loadNotifications()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Loading state
  if (loadingLaptop && !laptopSetup) {
    return (
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <LoadingState message="Loading profile..." />
        </InnerContainer>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <HeaderCard />
          <PageTitle>Devices & Settings</PageTitle>
          <SubTitle>Manage profiles and diagnostic preferences.</SubTitle>

          {/* User Account Info */}
          <View style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>
                  {user?.name} {user?.surname}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* Current Laptop */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Current Laptop</Text>
            {laptopSetup ? (
              <View style={styles.laptopCard}>
                <View style={styles.laptopHeader}>
                  <Feather name="laptop" size={24} color={brand} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.laptopName}>
                      {laptopSetup.brand} {laptopSetup.model}
                    </Text>
                    <Text style={styles.laptopStatus}>✓ Registered</Text>
                  </View>
                </View>

                {/* Laptop Specs Summary */}
                {laptopSpecs && (
                  <View style={styles.specsContainer}>
                    {laptopSpecs.cpu && (
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>CPU:</Text>
                        <Text style={styles.specValue}>{laptopSpecs.cpu}</Text>
                      </View>
                    )}
                    {laptopSpecs.gpu && (
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>GPU:</Text>
                        <Text style={styles.specValue}>{laptopSpecs.gpu}</Text>
                      </View>
                    )}
                    {laptopSpecs.ram && (
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>RAM:</Text>
                        <Text style={styles.specValue}>{laptopSpecs.ram}</Text>
                      </View>
                    )}
                    {laptopSpecs.storage && (
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>Storage:</Text>
                        <Text style={styles.specValue}>{laptopSpecs.storage}</Text>
                      </View>
                    )}
                    {laptopSpecs.os && (
                      <View style={styles.specRow}>
                        <Text style={styles.specLabel}>OS:</Text>
                        <Text style={styles.specValue}>{laptopSpecs.os}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.noLaptopCard}>
                <Feather name="alert-circle" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={styles.noLaptopText}>No laptop registered yet</Text>
              </View>
            )}
          </View>

          {/* Experience Level */}
          <View style={styles.experienceCard}>
            <Text style={styles.sectionTitle}>Experience Level</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setExperienceLevel('Beginner')}
                style={[
                  styles.experienceButton,
                  {
                    backgroundColor: experienceLevel === 'Beginner' ? brand : '#FFFFFF',
                    borderColor: experienceLevel === 'Beginner' ? brand : '#E2E8F0',
                  }
                ]}
              >
                <Text style={{
                  color: experienceLevel === 'Beginner' ? '#FFFFFF' : '#0F172A',
                  fontSize: 13,
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  Beginner
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setExperienceLevel('Intermediate')}
                style={[
                  styles.experienceButton,
                  {
                    backgroundColor: experienceLevel === 'Intermediate' ? brand : '#FFFFFF',
                    borderColor: experienceLevel === 'Intermediate' ? brand : '#E2E8F0',
                  }
                ]}
              >
                <Text style={{
                  color: experienceLevel === 'Intermediate' ? '#FFFFFF' : '#0F172A',
                  fontSize: 13,
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  Intermediate
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.experienceDescription}>
              {experienceLevel === 'Beginner'
                ? 'Beginner mode uses simpler instructions and stronger safety guidance.'
                : 'Intermediate mode includes hardware details and more technical troubleshooting.'}
            </Text>
          </View>

          {/* Notification Summary */}
          <View style={styles.notificationCard}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationRow}>
              <MaterialCommunityIcons name="bell-outline" size={20} color={brand} style={{ marginRight: 8 }} />
              <Text style={styles.notificationText}>
                {notifications.length} total • {unreadCount} unread
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <View style={{ marginTop: 20, marginBottom: 12 }}>
            <StyledButton onPress={handleLogout} style={{ backgroundColor: '#F97316' }}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </View>
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = {
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: darkLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  laptopCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  laptopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  laptopName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  laptopStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  specsContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  specLabel: {
    fontSize: 12,
    color: darkLight,
    fontWeight: '600',
    width: 70,
  },
  specValue: {
    fontSize: 12,
    color: '#0F172A',
    flex: 1,
  },
  noLaptopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noLaptopText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  experienceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  experienceButton: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 18,
    borderWidth: 1,
  },
  experienceDescription: {
    fontSize: 12,
    color: darkLight,
    marginTop: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
};

export default Profile;