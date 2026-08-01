//welcome.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text } from 'react-native';
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

const { brand, darkLight, tertiary } = Colors;

const statCards = [
  { label: 'CPU', value: '42%', key: 'cpu' },
  { label: 'GPU', value: '46°C', key: 'gpu' },
  { label: 'Storage', value: '258GB', key: 'storage' },
  { label: 'Battery', value: '94%', key: 'battery' },
];

const Welcome = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { activeDevice, devices, selectDevice, alerts, setEmergencyQuery } = useDashboard();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 36 }}>
          <View style={{ marginBottom: 28 }}>
            <PageTitle>PC Doctor Dashboard</PageTitle>
            <SubTitle>Monitor your device, prioritize alerts, and start diagnostics.</SubTitle>
          </View>

          <View style={{ backgroundColor: '#EFF6FF', borderRadius: 28, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ color: '#1D4ED8', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>Active Device</Text>
            <Text style={{ color: darkLight, fontSize: 13, marginBottom: 16 }}>{activeDevice.specs}</Text>
            <Text style={{ color: '#0F172A', fontSize: 24, fontWeight: '800', marginBottom: 18 }}>{activeDevice.name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {statCards.map((card) => {
                let value = card.value;
                if (card.key === 'cpu') value = `${activeDevice.cpuUsagePercentage}%`;
                if (card.key === 'gpu') value = `${activeDevice.gpuTempC}°C`;
                if (card.key === 'storage') value = `${activeDevice.storageUsedGB}GB`;
                if (card.key === 'battery') value = `${activeDevice.batteryPercentage}%`;
                return (
                  <View key={card.key} style={{ width: '48%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#DBEAFE' }}>
                    <Text style={{ fontSize: 12, color: darkLight, marginBottom: 8 }}>{card.label}</Text>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#0F172A' }}>{value}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Device List</Text>
            {devices.map((device) => (
              <StyledButton
                key={device.id}
                onPress={() => selectDevice(device.id)}
                style={{
                  backgroundColor: device.id === activeDevice.id ? brand : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: device.id === activeDevice.id ? brand : '#E2E8F0',
                  marginBottom: 12,
                }}
              >
                <ButtonText style={{ color: device.id === activeDevice.id ? '#FFFFFF' : '#0F172A' }}>{device.name}</ButtonText>
              </StyledButton>
            ))}
          </View>

          <View style={{ backgroundColor: '#DBEAFE', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#BFDBFE' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1D4ED8', marginBottom: 8 }}>Latest Alert</Text>
            {alerts[0] ? (
              <>
                <Text style={{ fontSize: 14, color: '#0F172A', fontWeight: '700' }}>{alerts[0].title}</Text>
                <Text style={{ color: darkLight, marginTop: 6 }}>{alerts[0].description}</Text>
                <Text style={{ color: darkLight, marginTop: 8, fontSize: 12 }}>{alerts[0].time}</Text>
              </>
            ) : (
              <Text style={{ color: darkLight }}>No outstanding alerts. Your systems are stable.</Text>
            )}
          </View>

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