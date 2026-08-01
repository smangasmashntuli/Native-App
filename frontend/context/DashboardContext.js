import React, { createContext, useContext, useMemo, useState } from 'react';

const DashboardContext = createContext(null);

const INITIAL_DEVICES = [
  {
    id: 'dev-1',
    name: 'MacBook Pro 16"',
    specs: 'M2 Max • 32GB RAM • 1TB SSD',
    processor: 'Apple M2 Max (12-core)',
    ram: '32GB Unified Memory',
    storage: '1TB NVMe Flash',
    gpu: '30-Core GPU',
    batteryHealth: 'Normal',
    batteryPercentage: 85,
    cpuUsagePercentage: 32,
    storageUsedGB: 422,
    storageTotalGB: 1024,
    gpuTempC: 48,
    cpuTempC: 62,
    fanSpeedRPM: 2400,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    isActive: true,
  },
  {
    id: 'dev-2',
    name: 'Home Workstation',
    specs: 'RTX 4080 • Core i9 • 64GB RAM',
    processor: 'Intel Core i9-14900K',
    ram: '64GB DDR5 6000MHz',
    storage: '2TB PCIe Gen4 SSD',
    gpu: 'NVIDIA RTX 4080 16GB',
    batteryHealth: 'AC Powered',
    batteryPercentage: 100,
    cpuUsagePercentage: 18,
    storageUsedGB: 890,
    storageTotalGB: 2048,
    gpuTempC: 42,
    cpuTempC: 55,
    fanSpeedRPM: 1800,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
    isActive: false,
  },
];

const INITIAL_ALERTS = [
  {
    id: 'alt-1',
    title: 'Urgent: OS Security Patch',
    description: 'Critical firmware patch available. Install now to protect hardware-level vulnerabilities.',
    time: '2 hours ago',
    category: 'security',
    severity: 'urgent',
    read: false,
  },
  {
    id: 'alt-2',
    title: 'Maintenance Tip',
    description: 'CPU temperature spike detected. Clear dust from intake vents and check fan speed.',
    time: 'Yesterday',
    category: 'maintenance',
    severity: 'warning',
    read: false,
  },
  {
    id: 'alt-3',
    title: 'Driver Alert',
    description: 'New stable GPU driver is available for your graphics subsystem.',
    time: '3 days ago',
    category: 'driver',
    severity: 'info',
    read: false,
  },
];

export const DashboardProvider = ({ children }) => {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [activeDeviceId, setActiveDeviceId] = useState(INITIAL_DEVICES[0].id);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [chatInitialQuery, setChatInitialQuery] = useState(undefined);

  const activeDevice = useMemo(
    () => devices.find((device) => device.id === activeDeviceId) || devices[0],
    [devices, activeDeviceId]
  );

  const selectDevice = (id) => {
    setDevices((prev) => prev.map((device) => ({ ...device, isActive: device.id === id })));
    setActiveDeviceId(id);
  };

  const addDevice = (device) => {
    setDevices((prev) => [{ ...device, isActive: true }, ...prev.map((d) => ({ ...d, isActive: false }))]);
    setActiveDeviceId(device.id);
  };

  const markAllAlertsRead = () => setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  const clearAlerts = () => setAlerts([]);
  const setEmergencyQuery = (query) => setChatInitialQuery(query);
  const resetChatInitialQuery = () => setChatInitialQuery(undefined);

  return (
    <DashboardContext.Provider
      value={{
        devices,
        activeDevice,
        activeDeviceId,
        alerts,
        experienceLevel,
        chatInitialQuery,
        selectDevice,
        addDevice,
        markAllAlertsRead,
        clearAlerts,
        setExperienceLevel,
        setEmergencyQuery,
        resetChatInitialQuery,
      }}
    >
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
