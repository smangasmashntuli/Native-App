import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle, SubTitle, Colors, StyledButton, ButtonText } from '../components/style';
import { useDashboard } from '../context/DashboardContext';

const { brand, darkLight, tertiary, green, border, secondary } = Colors;

const Home = ({ navigation }) => {
  const { activeDevice, setEmergencyQuery } = useDashboard();

  const emergencyItems = [
    { label: "Won't Turn On", icon: 'power', color: brand },
    { label: 'Loud Fans / Overheating', icon: 'fan', color: brand },
    { label: 'Blue Screen / Crash', icon: 'bug', color: brand },
    { label: 'No Wi-Fi / Network Drop', icon: 'wifi', color: brand },
  ];

  const handleEmergency = (issue) => {
    setEmergencyQuery(issue);
    navigation.navigate('Chat');
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <PageTitle>PC Doctor</PageTitle>
          <SubTitle>Live system telemetry, on-demand diagnostics, and repair guidance.</SubTitle>

          <View style={{ width: '100%', borderRadius: 24, overflow: 'hidden', marginBottom: 22, backgroundColor: tertiary }}>
            <Image
              source={{ uri: activeDevice.image }}
              style={{ width: '100%', height: 220, resizeMode: 'cover' }}
            />
            <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
              <Text style={{ color: secondary, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>Active Hardware Unit</Text>
              <Text style={{ color: secondary, fontSize: 22, fontWeight: '800' }}>{activeDevice.name}</Text>
              <Text style={{ color: darkLight, fontSize: 13, marginTop: 4 }}>{activeDevice.specs}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: secondary + '1f' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: green + '22' }} />
                  <Text style={{ color: secondary, fontSize: 11, fontWeight: '700' }}>Telemetry Optimal</Text>
                </View>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: secondary + '4d', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 }} onPress={() => navigation.navigate('Repair')}>
                  <Text style={{ color: secondary, fontSize: 11, fontWeight: '700' }}>Launch Lab</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: tertiary, fontSize: 16, fontWeight: '700' }}>Emergency Diagnostics</Text>
              <Text style={{ color: brand, fontSize: 11, fontWeight: '700' }}>Instant AI Triage</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
              {emergencyItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => handleEmergency(item.label)}
                  style={{
                    width: '48%',
                    backgroundColor: secondary,
                    borderRadius: 20,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: border,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: item.color + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <FontAwesome5 name={item.icon} size={18} color={item.color} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: tertiary }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: tertiary, fontSize: 16, fontWeight: '700' }}>System Health</Text>
              <Text style={{ color: brand, fontSize: 11, fontWeight: '700' }}>Live Telemetry</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
              <View style={{ width: '48%', borderRadius: 20, backgroundColor: secondary, padding: 16, borderWidth: 1, borderColor: border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Feather name="cpu" size={20} color={brand} />
                  <Text style={{ color: tertiary, fontWeight: '700', fontSize: 12 }}>{activeDevice.cpuUsagePercentage}%</Text>
                </View>
                <Text style={{ fontSize: 11, color: darkLight }}>Processor</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: tertiary, marginTop: 4 }}>{activeDevice.processor}</Text>
              </View>

              <View style={{ width: '48%', borderRadius: 20, backgroundColor: secondary, padding: 16, borderWidth: 1, borderColor: border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <FontAwesome5 name="battery-full" size={20} color={green} />
                  <Text style={{ color: green, fontWeight: '700', fontSize: 12 }}>{activeDevice.batteryPercentage}%</Text>
                </View>
                <Text style={{ fontSize: 11, color: darkLight }}>Battery Vitals</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: tertiary, marginTop: 4 }}>Health: {activeDevice.batteryHealth}</Text>
              </View>

              <View style={{ width: '48%', borderRadius: 20, backgroundColor: secondary, padding: 16, borderWidth: 1, borderColor: border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <MaterialCommunityIcons name="memory" size={20} color={brand} />
                  <Text style={{ color: tertiary, fontWeight: '700', fontSize: 12 }}>RAM</Text>
                </View>
                <Text style={{ fontSize: 11, color: darkLight }}>Capacity</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: tertiary, marginTop: 4 }}>{activeDevice.ram}</Text>
              </View>

              <View style={{ width: '48%', borderRadius: 20, backgroundColor: secondary, padding: 16, borderWidth: 1, borderColor: border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Feather name="database" size={20} color={brand} />
                  <Text style={{ color: tertiary, fontWeight: '700', fontSize: 12 }}>Storage</Text>
                </View>
                <Text style={{ fontSize: 11, color: darkLight }}>{activeDevice.storageUsedGB}GB / {activeDevice.storageTotalGB}GB</Text>
                <View style={{ height: 6, backgroundColor: border, borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.round((activeDevice.storageUsedGB / activeDevice.storageTotalGB) * 100)}%`, height: 6, backgroundColor: brand }} />
                </View>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', padding: 18, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
              <View>
                <Text style={{ color: tertiary, fontSize: 14, fontWeight: '700' }}>{activeDevice.gpu}</Text>
                <Text style={{ color: darkLight, fontSize: 12, marginTop: 4 }}>Thermal throttling: None detected</Text>
              </View>
              <View style={{ backgroundColor: '#DCFCE7', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 }}>
                <Text style={{ color: '#166534', fontWeight: '700', fontSize: 11 }}>{activeDevice.gpuTempC}°C</Text>
              </View>
            </View>
          </View>

          <StyledButton onPress={() => navigation.navigate('Repair')}>
            <ButtonText>Open Repair Lab</ButtonText>
          </StyledButton>
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Home;
