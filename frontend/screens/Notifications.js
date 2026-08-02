import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle, StyledButton, ButtonText } from '../components/style';

const { tertiary } = Colors;

const Notifications = () => {
  const { alerts, markAllAlertsRead, clearAlerts } = useDashboard();
  const [filter, setFilter] = useState('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'urgent') return alert.severity === 'urgent';
    if (filter === 'maintenance') return alert.category === 'maintenance';
    if (filter === 'driver') return alert.category === 'driver';
    return true;
  });

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <PageTitle>System Alerts</PageTitle>
          <SubTitle>Live hardware notifications and security advisories.</SubTitle>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {['all', 'urgent', 'maintenance', 'driver'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFilter(option)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: filter === option ? '#E0E7FF' : '#F8FAFC',
                  borderWidth: 1,
                  borderColor: filter === option ? '#4338CA' : '#E2E8F0',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#0F172A' }}>{option === 'all' ? 'All' : option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredAlerts.length === 0 ? (
            <View style={{ padding: 18, borderRadius: 24, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Text style={{ fontSize: 14, color: tertiary }}>No alerts in this category.</Text>
            </View>
          ) : (
            filteredAlerts.map((alert) => (
              <View key={alert.id} style={{ padding: 18, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: alert.severity === 'urgent' ? '#FECACA' : '#E2E8F0', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A' }}>{alert.title}</Text>
                  {!alert.read && <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#4338CA' }} />}
                </View>
                <Text style={{ fontSize: 12, color: tertiary, marginBottom: 8 }}>{alert.description}</Text>
                <Text style={{ fontSize: 11, color: tertiary }}>{alert.time}</Text>
              </View>
            ))
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <StyledButton onPress={markAllAlertsRead}>
              <ButtonText>Mark Read</ButtonText>
            </StyledButton>
            <StyledButton onPress={clearAlerts}>
              <ButtonText>Clear</ButtonText>
            </StyledButton>
          </View>
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

export default Notifications;
