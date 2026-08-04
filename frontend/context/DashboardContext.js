import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/apiService';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // API-driven state
  const [laptopSetup, setLaptopSetup] = useState(null);
  const [laptopSpecs, setLaptopSpecs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  // Loading states
  const [loadingLaptop, setLoadingLaptop] = useState(false);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Error states
  const [laptopError, setLaptopError] = useState(null);
  const [specsError, setSpecsError] = useState(null);
  const [notificationsError, setNotificationsError] = useState(null);

  // Local-only state (persisted in AsyncStorage)
  const [experienceLevel, setExperienceLevelState] = useState('Beginner');
  const [chatInitialQuery, setChatInitialQuery] = useState(undefined);

  // Load experience level from AsyncStorage on mount
  useEffect(() => {
    loadExperienceLevel();
  }, []);

  const loadExperienceLevel = async () => {
    try {
      const saved = await AsyncStorage.getItem('experienceLevel');
      if (saved) {
        setExperienceLevelState(saved);
      }
    } catch (error) {
      console.error('Error loading experience level:', error);
    }
  };

  const setExperienceLevel = async (level) => {
    setExperienceLevelState(level);
    try {
      await AsyncStorage.setItem('experienceLevel', level);
    } catch (error) {
      console.error('Error saving experience level:', error);
    }
  };

  // === Data Loading Methods ===

  const loadLaptopData = useCallback(async () => {
    setLoadingLaptop(true);
    setLaptopError(null);
    try {
      const status = await api.getSetupStatus();
      if (status.laptop) {
        setLaptopSetup(status.laptop);
        // Try to load specs if laptop is registered
        await loadLaptopSpecs(status.laptop.brand, status.laptop.model);
      } else {
        setLaptopSetup(null);
        setLaptopSpecs(null);
      }
    } catch (error) {
      console.error('Error loading laptop data:', error);
      setLaptopError(error.message || 'Failed to load laptop data');
    } finally {
      setLoadingLaptop(false);
    }
  }, []);

  const loadLaptopSpecs = useCallback(async (brand, model) => {
    setLoadingSpecs(true);
    setSpecsError(null);
    try {
      const result = await api.ingestLaptopSpecs(brand, model);
      if (result.specs) {
        setLaptopSpecs(result.specs);
      }
    } catch (error) {
      console.error('Error loading laptop specs:', error);
      setSpecsError(error.message || 'Failed to load laptop specifications');
    } finally {
      setLoadingSpecs(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    setNotificationsError(null);
    try {
      const result = await api.getNotifications();
      setNotifications(result);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotificationsError(error.message || 'Failed to load notifications');
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId);
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  const triggerMaintenanceAlerts = useCallback(async () => {
    try {
      const result = await api.triggerMaintenance();
      // Refresh notifications after triggering
      await loadNotifications();
      return result;
    } catch (error) {
      console.error('Error triggering maintenance alerts:', error);
      throw error;
    }
  }, [loadNotifications]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadLaptopData(),
      loadNotifications(),
    ]);
  }, [loadLaptopData, loadNotifications]);

  // === Local State Methods ===

  const setEmergencyQuery = (query) => setChatInitialQuery(query);
  const resetChatInitialQuery = () => setChatInitialQuery(undefined);

  // === Derived Data ===

  const activeDevice = laptopSetup
    ? {
        id: laptopSetup.id,
        name: `${laptopSetup.brand} ${laptopSetup.model}`,
        brand: laptopSetup.brand,
        model: laptopSetup.model,
        specs: laptopSpecs ? `${laptopSpecs.cpu || 'N/A'} • ${laptopSpecs.ram || 'N/A'} • ${laptopSpecs.storage || 'N/A'}` : 'Specs loading...',
        image: laptopSpecs?.image_url || null,
        cpu: laptopSpecs?.cpu || null,
        gpu: laptopSpecs?.gpu || null,
        ram: laptopSpecs?.ram || null,
        storage: laptopSpecs?.storage || null,
        display: laptopSpecs?.display || null,
        os: laptopSpecs?.os || null,
        knownIssues: laptopSpecs?.known_issues || [],
      }
    : null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value = {
    // API-driven data
    laptopSetup,
    laptopSpecs,
    activeDevice,
    notifications,
    user,
    unreadCount,

    // Loading states
    loadingLaptop,
    loadingSpecs,
    loadingNotifications,

    // Error states
    laptopError,
    specsError,
    notificationsError,

    // Local state
    experienceLevel,
    chatInitialQuery,

    // Data loading methods
    loadLaptopData,
    loadLaptopSpecs,
    loadNotifications,
    markNotificationAsRead,
    triggerMaintenanceAlerts,
    refreshAll,

    // Local state methods
    setExperienceLevel,
    setEmergencyQuery,
    resetChatInitialQuery,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};