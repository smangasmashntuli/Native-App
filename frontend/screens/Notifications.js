import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle, StyledButton, ButtonText } from '../components/style';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { FadeInDown } from '../components/animated';

const { tertiary, brand, darkLight } = Colors;

const Notifications = () => {
  const {
    notifications,
    loadingNotifications,
    notificationsError,
    loadNotifications,
    markNotificationAsRead,
    triggerMaintenanceAlerts,
    unreadCount,
  } = useDashboard();
  const [filter, setFilter] = useState('all');
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleTriggerMaintenance = async () => {
    setTriggering(true);
    try {
      await triggerMaintenanceAlerts();
    } catch (error) {
      console.error('Error triggering maintenance:', error);
    } finally {
      setTriggering(false);
    }
  };

  // Filter notifications by priority
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.is_read;
    if (filter === 'high') return notif.priority === 'high';
    if (filter === 'medium') return notif.priority === 'medium';
    if (filter === 'low') return notif.priority === 'low';
    return true;
  });

  // Get priority color
  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#FFD52C';
    if (priority === 'medium') return '#FFD52C';
    return '#17191D';
  };

  const getPriorityBorderColor = (priority) => {
    if (priority === 'high') return '#FFD52C';
    if (priority === 'medium') return '#FFD52C';
    return '#2FB8FF';
  };

  // Loading state
  if (loadingNotifications && notifications.length === 0) {
    return (
      <StyledContainer>
        <StatusBar style="light" />
        <InnerContainer>
          <LoadingState message="Loading notifications..." />
        </InnerContainer>
      </StyledContainer>
    );
  }

  // Error state
  if (notificationsError && notifications.length === 0) {
    return (
      <StyledContainer>
        <StatusBar style="light" />
        <InnerContainer>
          <ErrorState
            message={notificationsError}
            onRetry={loadNotifications}
            retryText="Retry"
          />
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
            <RefreshControl refreshing={loadingNotifications} onRefresh={onRefresh} />
          }
        >
          <FadeInDown delay={40}>
          <PageTitle>System Alerts</PageTitle>
          <SubTitle>Live hardware notifications and security advisories.</SubTitle>
          </FadeInDown>

          {/* Unread Count Summary */}
          {unreadCount > 0 && (
            <FadeInDown delay={120}>
            <View style={styles.unreadSummary}>
              <MaterialCommunityIcons name="bell-alert" size={20} color="#2FB8FF" style={{ marginRight: 8 }} />
              <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</Text>
            </View>
            </FadeInDown>
          )}

          {/* Filter Buttons */}
          <FadeInDown delay={180}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {['all', 'unread', 'high', 'medium', 'low'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFilter(option)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: filter === option ? 'rgba(47,184,255,0.16)' : '#17191D',
                  borderWidth: 1,
                  borderColor: filter === option ? '#2FB8FF' : '#23272C',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: filter === option ? '#2FB8FF' : '#8A9099', textTransform: 'capitalize' }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </FadeInDown>

          {/* Trigger Maintenance Button */}
          <View style={{ marginBottom: 18 }}>
            <StyledButton
              onPress={handleTriggerMaintenance}
              style={{ backgroundColor: triggering ? '#23272C' : '#2FB8FF' }}
              disabled={triggering}
            >
              <MaterialCommunityIcons name="bell-outline" size={18} color="#050505" />
              <ButtonText>{triggering ? 'Generating...' : 'Trigger Maintenance Alerts'}</ButtonText>
            </StyledButton>
          </View>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon="bell-outline"
              message={filter === 'all' ? 'No notifications yet. Trigger maintenance alerts to get started.' : `No ${filter} notifications.`}
            />
          ) : (
            filteredNotifications.map((notif) => (
              <View
                key={notif.id}
                style={{
                  padding: 18,
                  borderRadius: 24,
                  backgroundColor: '#17191D',
                  borderWidth: 1,
                  borderColor: notif.priority === 'high' ? '#FFD52C' : '#23272C',
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: getPriorityBorderColor(notif.priority),
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', flex: 1 }}>{notif.title}</Text>
                  {!notif.is_read && (
                    <View style={{ width: 10, height: 10, borderRadius: 10, backgroundColor: '#2FB8FF' }} />
                  )}
                </View>
                <Text style={{ fontSize: 12, color: darkLight, marginBottom: 8 }}>{notif.message}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                      backgroundColor: getPriorityColor(notif.priority),
                      marginRight: 8,
                    }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF', textTransform: 'capitalize' }}>
                        {notif.priority}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: darkLight }}>
                      {notif.notification_type}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: darkLight }}>
                    {new Date(notif.created_at).toLocaleDateString()}
                  </Text>
                </View>
                {!notif.is_read && (
                  <TouchableOpacity
                    onPress={() => handleMarkRead(notif.id)}
                    style={styles.markReadButton}
                  >
                    <Text style={styles.markReadText}>Mark as Read</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = {
  unreadSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17191D',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#23272C',
  },
  unreadText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2FB8FF',
  },
  markReadButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#17191D',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
};

export default Notifications;