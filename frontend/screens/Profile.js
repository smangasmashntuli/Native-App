import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../components/style';

const { brand } = Colors;

const Profile = () => {
    return (
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Profile</PageTitle>
                <Text>Your profile information will appear here.</Text>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Profile;