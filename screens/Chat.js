import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../components/style';

const { brand } = Colors;

const Chat = () => {
    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Chat</PageTitle>
                <Text>Chat with technicians here.</Text>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Chat;