import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle, StyledButton, ButtonText } from '../components/style';

const { brand, tertiary, darkLight } = Colors;

const Profile = () => {
  const { devices, activeDeviceId, selectDevice, experienceLevel, setExperienceLevel, alerts, addDevice } = useDashboard();

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <PageTitle>Devices & Settings</PageTitle>
          <SubTitle>Manage profiles and diagnostic preferences.</SubTitle>

          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>Active Devices</Text>
              <StyledButton onPress={() => addDevice({
                id: `dev-${Date.now()}`,
                name: 'New Device',
                specs: 'Custom • 16GB RAM • 512GB SSD',
                processor: 'Intel Core i7-14700K',
                ram: '16GB DDR5',
                storage: '512GB NVMe SSD',
                gpu: 'NVIDIA RTX 4060',
                batteryHealth: 'Normal',
                batteryPercentage: 94,
                cpuUsagePercentage: 22,
                storageUsedGB: 258,
                storageTotalGB: 512,
                gpuTempC: 46,
                cpuTempC: 53,
                fanSpeedRPM: 1900,
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
                isActive: true,
              })}>
                <ButtonText>Quick Add</ButtonText>
              </StyledButton>
            </View>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                onPress={() => selectDevice(device.id)}
                style={{
                  padding: 16,
                  borderRadius: 24,
                  backgroundColor: device.id === activeDeviceId ? '#EEF2FF' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: device.id === activeDeviceId ? brand : '#E2E8F0',
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{device.name}</Text>
                <Text style={{ fontSize: 12, color: darkLight, marginTop: 4 }}>{device.specs}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginBottom: 20, padding: 18, borderRadius: 24, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E0E7FF' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Experience Level</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setExperienceLevel('Beginner')}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  marginRight: 8,
                  borderRadius: 18,
                  backgroundColor: experienceLevel === 'Beginner' ? brand : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: experienceLevel === 'Beginner' ? brand : '#E2E8F0',
                }}
              >
                <Text style={{ color: experienceLevel === 'Beginner' ? '#FFFFFF' : '#0F172A', fontSize: 13, fontWeight: '700', textAlign: 'center' }}>Beginner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setExperienceLevel('Intermediate')}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  marginLeft: 8,
                  borderRadius: 18,
                  backgroundColor: experienceLevel === 'Intermediate' ? brand : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: experienceLevel === 'Intermediate' ? brand : '#E2E8F0',
                }}
              >
                <Text style={{ color: experienceLevel === 'Intermediate' ? '#FFFFFF' : '#0F172A', fontSize: 13, fontWeight: '700', textAlign: 'center' }}>Intermediate</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 12, color: tertiary, marginTop: 12 }}>
              {experienceLevel === 'Beginner'
                ? 'Beginner mode uses simpler instructions and stronger safety guidance.'
                : 'Intermediate mode includes hardware details and more technical troubleshooting.'}
            </Text>
          </View>

          <View style={{ padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Recent Alerts</Text>
            <Text style={{ fontSize: 12, color: tertiary }}>{alerts.length} notifications generated from diagnostics and telemetry.</Text>
          </View>
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Profile;
