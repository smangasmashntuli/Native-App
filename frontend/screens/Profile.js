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
import { FadeInDown } from '../components/animated';

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
        <StatusBar style="light" />
        <InnerContainer>
          <LoadingState message="Loading profile..." />
        </InnerContainer>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StatusBar style="light" />
      <InnerContainer>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <FadeInDown delay={40}>
          <PageTitle>Devices & Settings</PageTitle>
          <SubTitle>Manage profiles and diagnostic preferences.</SubTitle>
          </FadeInDown>

          {/* User Account Info */}
          <FadeInDown delay={130}>
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
          </FadeInDown>

          {/* Current Laptop */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Current Laptop</Text>
            {laptopSetup ? (
              <View style={styles.laptopCard}>
                <View style={styles.laptopHeader}>
                  <Feather name="monitor" size={24} color={brand} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.laptopName}>
                      {laptopSetup.brand} {laptopSetup.model}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="check-circle" size={14} color="#10B981" style={{ marginRight: 6 }} />
                      <Text style={styles.laptopStatus}>Registered</Text>
                    </View>
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
                <Feather name="alert-circle" size={20} color="#FFD52C" style={{ marginRight: 8 }} />
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
                    backgroundColor: experienceLevel === 'Beginner' ? brand : '#17191D',
                    borderColor: experienceLevel === 'Beginner' ? brand : '#23272C',
                  }
                ]}
              >
                <Text style={{
                  color: experienceLevel === 'Beginner' ? '#FFFFFF' : '#8A9099',
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
                    backgroundColor: experienceLevel === 'Intermediate' ? brand : '#17191D',
                    borderColor: experienceLevel === 'Intermediate' ? brand : '#23272C',
                  }
                ]}
              >
                <Text style={{
                  color: experienceLevel === 'Intermediate' ? '#FFFFFF' : '#8A9099',
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
            <StyledButton onPress={handleLogout} style={{ backgroundColor: '#2FB8FF' }}>
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
    backgroundColor: '#17191D',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#23272C',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: darkLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  laptopCard: {
    backgroundColor: '#17191D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23272C',
  },
  laptopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  laptopName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  laptopStatus: {
    fontSize: 12,
    color: '#2FB8FF',
    fontWeight: '600',
  },
  specsContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#23272C',
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
    color: '#FFFFFF',
    flex: 1,
  },
  noLaptopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD52C33',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFD52C',
  },
  noLaptopText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  experienceCard: {
    backgroundColor: '#17191D',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#23272C',
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
    backgroundColor: '#17191D',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23272C',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
};

export default Profile;