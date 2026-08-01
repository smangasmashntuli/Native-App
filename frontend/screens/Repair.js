export { default } from './RepairScreen';import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../components/style';

const { brand } = Colors;

const Repair = () => {
    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Repair</PageTitle>
                <Text>Track your repair requests here.</Text>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Repair;