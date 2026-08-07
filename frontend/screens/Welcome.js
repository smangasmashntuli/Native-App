//welcome.js
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  Colors,
  SubTitle,
  StyledButton,
  ButtonText,
} from '../components/style';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const { brand, darkLight, tertiary } = Colors;

const Welcome = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const {
    activeDevice,
    laptopSetup,
    laptopSpecs,
    notifications,
    loadingLaptop,
    loadingSpecs,
    laptopError,
    specsError,
    loadLaptopData,
    loadLaptopSpecs,
    loadNotifications,
    setEmergencyQuery,
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
    navigation.navigate('Login');
  };

  const handleTriggerIngestion = async () => {
    if (laptopSetup) {
      await loadLaptopSpecs(laptopSetup.brand, laptopSetup.model);
    }
  };

  // Loading state
  if (loadingLaptop && !activeDevice) {
    return (
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <LoadingState message="Loading your laptop information..." />
        </InnerContainer>
      </StyledContainer>
    );
  }

  // Error state
  if (laptopError && !activeDevice) {
    return (
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <ErrorState
            message={laptopError}
            onRetry={loadLaptopData}
            retryText="Retry"
          />
        </InnerContainer>
      </StyledContainer>
    );
  }

  // Empty state - no laptop registered
  if (!activeDevice) {
    return (
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 36 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ marginBottom: 28 }}>
              <PageTitle>PC Doctor Dashboard</PageTitle>
              <SubTitle>Monitor your device, prioritize alerts, and start diagnostics.</SubTitle>
            </View>
            <EmptyState
              icon="💻"
              message="No laptop registered yet. Set up your device to get started."
              actionText="Set Up Laptop"
              onAction={() => navigation.navigate('SetUp')}
            />
          </ScrollView>
        </InnerContainer>
      </StyledContainer>
    );
  }

  // Build spec cards from real data
  const specCards = [
    { label: 'CPU', value: laptopSpecs?.cpu || 'N/A', key: 'cpu' },
    { label: 'GPU', value: laptopSpecs?.gpu || 'N/A', key: 'gpu' },
    { label: 'RAM', value: laptopSpecs?.ram || 'N/A', key: 'ram' },
    { label: 'Storage', value: laptopSpecs?.storage || 'N/A', key: 'storage' },
  ];

  // Get latest notification
  const latestAlert = notifications[0];

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 36 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ marginBottom: 28 }}>
            <PageTitle>PC Doctor Dashboard</PageTitle>
            <SubTitle>Monitor your device, prioritize alerts, and start diagnostics.</SubTitle>
          </View>

          {/* Active Device Card */}
          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ color: '#1D4ED8', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Active Device</Text>
            <Text style={{ color: darkLight, fontSize: 13, marginBottom: 16 }}>{activeDevice.specs}</Text>
            <Text style={{ color: '#0F172A', fontSize: 24, fontWeight: '800', marginBottom: 18 }}>{activeDevice.name}</Text>

            {/* Laptop Image */}
            {activeDevice.image ? (
              <View style={{ marginBottom: 16, alignItems: 'center' }}>
                <Image
                  source={{ uri: activeDevice.image }}
                  style={{ width: 200, height: 150, borderRadius: 12, resizeMode: 'contain' }}
                />
              </View>
            ) : loadingSpecs ? (
              <View style={{ marginBottom: 16, alignItems: 'center' }}>
                <LoadingState message="Fetching laptop image..." size="small" />
              </View>
            ) : (
              <View style={{ marginBottom: 16, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center' }}>
                <Text style={{ color: darkLight, fontSize: 12, marginBottom: 8 }}>No image available</Text>
                <TouchableOpacity onPress={handleTriggerIngestion}>
                  <Text style={{ color: brand, fontSize: 12, fontWeight: '700' }}>Fetch Specs & Image</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Spec Cards */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {specCards.map((card) => (
                <View key={card.key} style={{ width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
                  <Text style={{ fontSize: 12, color: darkLight, marginBottom: 8 }}>{card.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>{card.value}</Text>
                </View>
              ))}
            </View>

            {/* Additional Specs */}
            {(laptopSpecs?.display || laptopSpecs?.os) && (
              <View style={{ marginTop: 8, padding: 12, backgroundColor: '#FFFFFF', borderRadius: 16 }}>
                {laptopSpecs?.display && (
                  <Text style={{ fontSize: 12, color: darkLight, marginBottom: 4 }}>
                    Display: {laptopSpecs.display}
                  </Text>
                )}
                {laptopSpecs?.os && (
                  <Text style={{ fontSize: 12, color: darkLight }}>
                    OS: {laptopSpecs.os}
                  </Text>
                )}
              </View>
            )}

            {/* Known Issues */}
            {laptopSpecs?.known_issues && laptopSpecs.known_issues.length > 0 && (
              <View style={{ marginTop: 12, padding: 12, backgroundColor: '#FEF3C7', borderRadius: 16, borderWidth: 1, borderColor: '#FDE68A' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400E', marginBottom: 6 }}>Known Issues:</Text>
                {laptopSpecs.known_issues.slice(0, 3).map((issue, idx) => (
                  <Text key={idx} style={{ fontSize: 11, color: '#92400E', marginBottom: 2 }}>• {issue}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Latest Alert */}
          <View style={{ backgroundColor: '#DBEAFE', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1D4ED8', marginBottom: 8 }}>Latest Alert</Text>
            {latestAlert ? (
              <>
                <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>{latestAlert.title}</Text>
                <Text style={{ color: darkLight, marginTop: 6 }}>{latestAlert.message}</Text>
                <Text style={{ color: darkLight, marginTop: 8, fontSize: 12 }}>
                  {latestAlert.priority} • {new Date(latestAlert.created_at).toLocaleDateString()}
                </Text>
              </>
            ) : (
              <Text style={{ color: darkLight }}>No outstanding alerts. Your systems are stable.</Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={{ marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <StyledButton onPress={() => navigation.navigate('Chat')} style={{ flexBasis: '48%', marginBottom: 12 }}>
              <ButtonText>Chat with AI</ButtonText>
            </StyledButton>
            <StyledButton
              onPress={() => {
                setEmergencyQuery('Please perform a complete system diagnostic and give me the most urgent repair recommendations.');
                navigation.navigate('Chat');
              }}
              style={{ flexBasis: '48%', marginBottom: 12 }}
            >
              <ButtonText>Quick Diagnose</ButtonText>
            </StyledButton>
          </View>

          {/* Logout */}
          <View style={{ marginBottom: 12 }}>
            <StyledButton onPress={handleLogout} style={{ backgroundColor: '#F97316' }}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </View>
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Welcome;