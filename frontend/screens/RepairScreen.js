import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle } from '../components/style';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/apiService';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ComponentInfoModal from '../components/ComponentInfoModal';

const { brand, darkLight, tertiary } = Colors;

// Component definitions with positions for 2D layout
const COMPONENT_LAYOUT = [
  {
    name: 'RAM',
    icon: 'memory',
    description: 'Random Access Memory',
    position: { top: '30%', left: '15%', width: '30%', height: '15%' },
    color: 'secondary',
    borderColor: 'brand',
  },
  {
    name: 'SSD',
    icon: 'harddisk',
    description: 'Solid State Drive',
    position: { top: '50%', left: '55%', width: '25%', height: '12%' },
    color: 'secondary',
    borderColor: 'brand',
  },
  {
    name: 'Battery',
    icon: 'battery',
    description: 'Power Source',
    position: { top: '65%', left: '20%', width: '50%', height: '15%' },
    color: 'Colors.warning + "33"',
    borderColor: 'Colors.warning',
    isRisky: true,
  },
  {
    name: 'Fan',
    icon: 'fan',
    description: 'Cooling System',
    position: { top: '15%', left: '55%', width: '25%', height: '15%' },
    color: 'Colors.warning + "33"',
    borderColor: 'Colors.warning',
  },
  {
    name: 'Cover',
    icon: 'square-outline',
    description: 'Bottom Cover',
    position: { top: '5%', left: '5%', width: '90%', height: '90%' },
    color: 'transparent',
    borderColor: 'border',
    isBase: true,
  },
];

const RepairScreen = () => {
  const { activeDevice, laptopSetup, loadingLaptop, laptopError, loadLaptopData } = useDashboard();
  const [modelData, setModelData] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (laptopSetup) {
      loadModelData();
    }
  }, [laptopSetup]);

  const loadModelData = async () => {
    if (!laptopSetup) return;
    setLoadingModel(true);
    setModelError(null);
    try {
      const data = await api.getLaptop3DModel(laptopSetup.id);
      setModelData(data);
    } catch (error) {
      console.error('Error loading 3D model data:', error);
      setModelError(error.message || 'Failed to load model data');
    } finally {
      setLoadingModel(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLaptopData();
    if (laptopSetup) {
      await loadModelData();
    }
    setRefreshing(false);
  };

  const handleComponentPress = async (componentName) => {
    setSelectedComponent(componentName);
    setModalVisible(true);
    setExplanation('');
    setLoadingExplanation(true);

    try {
      const response = await api.explainComponent({
        component_name: componentName,
        laptop_brand: laptopSetup?.brand || '',
        laptop_model: laptopSetup?.model || '',
      });
      setExplanation(response.explanation);
    } catch (error) {
      console.error('Error fetching component explanation:', error);
      setExplanation('');
    } finally {
      setLoadingExplanation(false);
    }
  };

  // Loading state
  if (loadingLaptop && !activeDevice) {
    return (
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <LoadingState message="Loading laptop information..." />
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
          <EmptyState
            icon="💻"
            message="No laptop registered. Set up your device to access the repair guide."
            actionText="Set Up Laptop"
            onAction={() => navigation.navigate('SetUp')}
          />
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
          contentContainerStyle={{ paddingBottom: 36, paddingTop: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={{ marginBottom: 20 }}>
            <PageTitle>Interactive Repair</PageTitle>
            <SubTitle>Tap components to learn about your {activeDevice.name}</SubTitle>
          </View>

          {/* Laptop Image */}
          {modelData?.image_url || activeDevice.image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: modelData?.image_url || activeDevice.image }}
                style={styles.laptopImage}
                resizeMode="contain"
              />
            </View>
          ) : loadingModel ? (
            <View style={styles.imageContainer}>
              <LoadingState message="Loading laptop image..." size="small" />
            </View>
          ) : null}

          {/* 2D Interactive Component Layout */}
          <View style={styles.componentContainer}>
            <Text style={styles.sectionTitle}>Internal Components</Text>
            <Text style={styles.sectionSubtitle}>Tap any component to learn more</Text>

            {/* Component Grid */}
            <View style={styles.componentGrid}>
              {COMPONENT_LAYOUT.filter(c => !c.isBase).map((component) => (
                <TouchableOpacity
                  key={component.name}
                  style={[
                    styles.componentCard,
                    { backgroundColor: component.color, borderColor: component.borderColor }
                  ]}
                  onPress={() => handleComponentPress(component.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.componentIcon}>
                    <MaterialCommunityIcons name={component.icon} size={28} color="tertiary" />
                  </View>
                  <Text style={styles.componentName}>{component.name}</Text>
                  <Text style={styles.componentDesc}>{component.description}</Text>
                  {component.isRisky && (
                    <View style={styles.riskyBadge}>
                      <AntDesign name="exclamationcircle" size={10} color="tertiary" />
                      <Text style={styles.riskyText}>Caution</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Safety Warning */}
          <View style={styles.safetyBanner}>
            <AntDesign name="exclamationcircle" size={18} color="tertiary" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.safetyTitle}>Safety First</Text>
              <Text style={styles.safetyMessage}>
                Always power off and disconnect the battery before opening your laptop.
                If you're unsure, consult a professional technician.
              </Text>
            </View>
          </View>

          {/* Model Info */}
          {modelData && (
            <View style={styles.modelInfoCard}>
              <Text style={styles.modelInfoTitle}>Model Information</Text>
              <Text style={styles.modelInfoText}>Category: {modelData.category}</Text>
              <Text style={styles.modelInfoText}>Brand: {modelData.brand}</Text>
              <Text style={styles.modelInfoText}>Model: {modelData.model_name}</Text>
            </View>
          )}
        </ScrollView>
      </InnerContainer>

      {/* Component Info Modal */}
      <ComponentInfoModal
        visible={modalVisible}
        componentName={selectedComponent}
        explanation={explanation}
        loading={loadingExplanation}
        onClose={() => setModalVisible(false)}
      />
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'secondary',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'border',
  },
  laptopImage: {
    width: 250,
    height: 180,
    borderRadius: 12,
  },
  componentContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'tertiary',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: darkLight,
    marginBottom: 16,
  },
  componentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 12,
    alignItems: 'center',
    position: 'relative',
  },
  componentIcon: {
    marginBottom: 8,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '700',
    color: 'tertiary',
    marginBottom: 4,
  },
  componentDesc: {
    fontSize: 11,
    color: darkLight,
    textAlign: 'center',
  },
  riskyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'Colors.warning + "33"',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  riskyText: {
    fontSize: 9,
    color: 'tertiary',
    fontWeight: '700',
    marginLeft: 2,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'Colors.warning + "33"',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'Colors.warning',
    padding: 16,
    marginBottom: 20,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'tertiary',
    marginBottom: 4,
  },
  safetyMessage: {
    fontSize: 12,
    color: 'tertiary',
    lineHeight: 18,
  },
  modelInfoCard: {
    backgroundColor: 'secondary',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'border',
  },
  modelInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'tertiary',
    marginBottom: 8,
  },
  modelInfoText: {
    fontSize: 12,
    color: darkLight,
    marginBottom: 4,
  },
});

export default RepairScreen;