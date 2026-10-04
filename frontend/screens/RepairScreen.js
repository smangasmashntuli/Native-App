import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useDashboard } from '../context/DashboardContext';
import { Colors, StyledContainer, InnerContainer, PageTitle, SubTitle } from '../components/style';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/apiService';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ComponentInfoModal from '../components/ComponentInfoModal';
import { FadeInDown } from '../components/animated';

const { brand, darkLight, tertiary } = Colors;

// Component definitions with positions for 2D layout
const COMPONENT_LAYOUT = [
  {
    name: 'RAM',
    icon: 'memory',
    description: 'Random Access Memory',
    position: { top: '30%', left: '15%', width: '30%', height: '15%' },
    color: '#17191D',
    borderColor: '#2FB8FF',
  },
  {
    name: 'SSD',
    icon: 'harddisk',
    description: 'Solid State Drive',
    position: { top: '50%', left: '55%', width: '25%', height: '12%' },
    color: '#17191D',
    borderColor: '#2FB8FF',
  },
  {
    name: 'Battery',
    icon: 'battery',
    description: 'Power Source',
    position: { top: '65%', left: '20%', width: '50%', height: '15%' },
    color: '#FFD52C33',
    borderColor: '#FFD52C',
    isRisky: true,
  },
  {
    name: 'Fan',
    icon: 'fan',
    description: 'Cooling System',
    position: { top: '15%', left: '55%', width: '25%', height: '15%' },
    color: '#FFD52C33',
    borderColor: '#FFD52C',
  },
  {
    name: 'Cover',
    icon: 'square-outline',
    description: 'Bottom Cover',
    position: { top: '5%', left: '5%', width: '90%', height: '90%' },
    color: 'transparent',
    borderColor: '#23272C',
    isBase: true,
  },
];

const RepairScreen = () => {
  const navigation = useNavigation();
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
        <StatusBar style="light" />
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
        <StatusBar style="light" />
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
        <StatusBar style="light" />
        <InnerContainer>
          <EmptyState
            icon="laptop"
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
      <StatusBar style="light" />
      <InnerContainer>
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 36, paddingTop: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <FadeInDown delay={40}>
          <View style={{ marginBottom: 20 }}>
            <PageTitle>Interactive Repair</PageTitle>
            <SubTitle>Tap components to learn about your {activeDevice.name}</SubTitle>
          </View>
          </FadeInDown>

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
          <FadeInDown delay={160}>
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
                    <MaterialCommunityIcons name={component.icon} size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.componentName}>{component.name}</Text>
                  <Text style={styles.componentDesc}>{component.description}</Text>
                  {component.isRisky && (
                    <View style={styles.riskyBadge}>
                      <AntDesign name="exclamationcircle" size={10} color="#FFD52C" />
                      <Text style={styles.riskyText}>Caution</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          </FadeInDown>

          {/* Safety Warning */}
          <FadeInDown delay={260}>
          <View style={styles.safetyBanner}>
            <AntDesign name="exclamationcircle" size={18} color="#FFD52C" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.safetyTitle}>Safety First</Text>
              <Text style={styles.safetyMessage}>
                Always power off and disconnect the battery before opening your laptop.
                If you're unsure, consult a professional technician.
              </Text>
            </View>
          </View>
          </FadeInDown>

          {/* Model Info */}
          {modelData && (
            <FadeInDown delay={340}>
            <View style={styles.modelInfoCard}>
              <Text style={styles.modelInfoTitle}>Model Information</Text>
              <Text style={styles.modelInfoText}>Category: {modelData.category}</Text>
              <Text style={styles.modelInfoText}>Brand: {modelData.brand}</Text>
              <Text style={styles.modelInfoText}>Model: {modelData.model_name}</Text>
            </View>
            </FadeInDown>
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
    backgroundColor: '#17191D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#23272C',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    backgroundColor: '#FFD52C33',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  riskyText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 2,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFD52C33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD52C',
    padding: 16,
    marginBottom: 20,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  safetyMessage: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  modelInfoCard: {
    backgroundColor: '#17191D',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#23272C',
  },
  modelInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modelInfoText: {
    fontSize: 12,
    color: darkLight,
    marginBottom: 4,
  },
});

export default RepairScreen;