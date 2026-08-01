import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { OrbitControls, useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';

import api from '../api/apiService';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../components/style';

const { brand, darkLight, primary, tertiary, lightDark } = Colors;

const COMPONENT_NODE_MAPPING = {
    RAM: 'mesh_ram_01',
    SSD: 'mesh_nvme_01',
    Battery: 'mesh_batt_01',
    Fan: 'mesh_fan_01',
    Cover: 'mesh_bottom_cover',
};

const AnimatedNode = ({ node, highlighted, isDisassembled, name }) => {
    const ref = useRef();
    const basePosition = useRef(node.position.clone());
    const originalMaterial = useMemo(() => node.material.clone(), [node.material]);

    useFrame((_, delta) => {
        if (!ref.current) return;

        const targetOffset = name === 'Cover'
            ? new THREE.Vector3(0, isDisassembled ? 1.5 : 0, isDisassembled ? 0.2 : 0)
            : new THREE.Vector3(0, isDisassembled ? 0.18 : 0, isDisassembled ? 0.08 : 0);

        ref.current.position.lerp(basePosition.current.clone().add(targetOffset), Math.min(1, delta * 5));

        if (highlighted) {
            ref.current.material.emissive = new THREE.Color(brand);
            ref.current.material.emissiveIntensity = 0.4;
            ref.current.material.wireframe = false;
        } else {
            ref.current.material.copy(originalMaterial);
        }
    });

    return (
        <mesh
            ref={ref}
            geometry={node.geometry}
            material={node.material}
            castShadow
            receiveShadow
            onPointerDown={node.userData?.onPointerDown}
        />
    );
};

const LaptopModel = ({ url, selectedNode, isDisassembled, onNodePress }) => {
    const gltf = useGLTF(url);
    const scene = gltf.scene || gltf.scenes?.[0];

    const nodesByName = useMemo(() => {
        const map = {};
        if (!scene) return map;

        scene.traverse((node) => {
            if (node.isMesh && node.name) {
                map[node.name] = node;
            }
        });
        return map;
    }, [scene]);

    if (!scene) return null;

    return (
        <group>
            <primitive object={scene} />
            {Object.entries(COMPONENT_NODE_MAPPING).map(([label, nodeName]) => {
                const node = nodesByName[nodeName];
                if (!node) return null;

                node.userData = {
                    ...node.userData,
                    onPointerDown: () => onNodePress(label),
                };

                return (
                    <AnimatedNode
                        key={nodeName}
                        name={label}
                        node={node}
                        highlighted={selectedNode === label}
                        isDisassembled={isDisassembled}
                    />
                );
            })}
        </group>
    );
};

const RepairScreen = () => {
    const [modelData, setModelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const [isDisassembled, setIsDisassembled] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [explanation, setExplanation] = useState('');
    const sheetY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const laptopId = 1;
                const data = await api.getLaptop3DModel(laptopId);
                if (mounted) setModelData(data);
            } catch (error) {
                if (mounted) {
                    setModelData({
                        laptop_id: 1,
                        brand: 'Generic',
                        model_name: 'Reference Laptop',
                        model_url: 'https://assets.pc-docter-ai.local/models/default-laptop.glb',
                        component_nodes: COMPONENT_NODE_MAPPING,
                    });
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        Animated.timing(sheetY, {
            toValue: selectedNode ? 1 : 0,
            duration: 240,
            useNativeDriver: true,
        }).start();
    }, [selectedNode, sheetY]);

    const handleNodePress = async (componentName) => {
        setSelectedNode(componentName);
        setLoadingExplanation(true);

        try {
            const payload = await api.explainComponent({
                component_name: componentName,
                laptop_brand: modelData?.brand || 'Unknown',
                laptop_model: modelData?.model_name || 'Unknown',
            });
            setExplanation(payload.explanation || 'No explanation available.');
        } catch (error) {
            setExplanation('Unable to fetch the explanation right now.');
        } finally {
            setLoadingExplanation(false);
        }
    };

    const toggleDisassembly = () => setIsDisassembled((value) => !value);

    return (
        <StyledContainer>
            <StatusBar style="light" />
            <InnerContainer style={styles.container}>
                <PageTitle>Repair Studio</PageTitle>
                <Text style={styles.subtitle}>Tap a part to learn what it does. Disassemble to expose the internals.</Text>

                <View style={styles.canvasShell}>
                    {loading ? (
                        <ActivityIndicator size="large" color={brand} />
                    ) : (
                        <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 45 }}>
                            <ambientLight intensity={0.95} />
                            <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow />
                            <pointLight position={[-4, 2, 2]} intensity={0.5} />
                            {modelData?.model_url ? (
                                <LaptopModel
                                    url={modelData.model_url}
                                    selectedNode={selectedNode}
                                    isDisassembled={isDisassembled}
                                    onNodePress={handleNodePress}
                                />
                            ) : null}
                            <OrbitControls enablePan={false} enableZoom={true} />
                        </Canvas>
                    )}
                </View>

                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.primaryButton} onPress={toggleDisassembly}>
                        <Text style={styles.primaryButtonText}>{isDisassembled ? 'Assemble' : 'Disassemble'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.modelLabel} numberOfLines={2}>
                        {modelData ? `${modelData.brand} ${modelData.model_name}` : 'Loading model...'}
                    </Text>
                </View>
            </InnerContainer>

            <Modal transparent visible={Boolean(selectedNode)} animationType="slide" onRequestClose={() => setSelectedNode(null)}>
                <View style={styles.modalBackdrop}>
                    <Animated.View
                        style={[
                            styles.sheet,
                            {
                                transform: [{
                                    translateY: sheetY.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [340, 0],
                                    }),
                                }],
                            },
                        ]}
                    >
                        <View style={styles.sheetHandle} />
                        <Text style={styles.sheetTitle}>{selectedNode}</Text>
                        <ScrollView style={styles.sheetBody} contentContainerStyle={styles.sheetBodyContent}>
                            {loadingExplanation ? (
                                <ActivityIndicator size="small" color={primary} />
                            ) : (
                                <Text style={styles.sheetText}>{explanation}</Text>
                            )}
                        </ScrollView>
                        <Pressable style={styles.closeButton} onPress={() => setSelectedNode(null)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Modal>
        </StyledContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12,
    },
    subtitle: {
        color: lightDark,
        marginTop: 8,
        marginBottom: 16,
        lineHeight: 20,
    },
    canvasShell: {
        flex: 1,
        minHeight: 420,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#0B1220',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolbar: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: brand,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 16,
        minWidth: 132,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    modelLabel: {
        flex: 1,
        color: darkLight,
        textAlign: 'right',
        fontWeight: '600',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(4, 10, 24, 0.66)',
        justifyContent: 'flex-end',
    },
    sheet: {
        minHeight: 260,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
    },
    sheetHandle: {
        alignSelf: 'center',
        width: 54,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#CBD5E1',
        marginBottom: 14,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 10,
    },
    sheetBody: {
        maxHeight: 180,
    },
    sheetBodyContent: {
        paddingBottom: 12,
    },
    sheetText: {
        color: '#334155',
        fontSize: 15,
        lineHeight: 22,
    },
    closeButton: {
        marginTop: 12,
        backgroundColor: tertiary,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
});

export default RepairScreen;