import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../components/style';

const { brand } = Colors;

const Notifications = () => {
    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Notifications</PageTitle>
                <Text>Your notifications will appear here.</Text>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Notifications;