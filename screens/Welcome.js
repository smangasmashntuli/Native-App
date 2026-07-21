//welcome.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { 
    StyledContainer,
    InnerContainer,
    PageTitle,
    Colors,
    SubTitle,
    StyledButton,
    ButtonText
} from "../components/style";

const { brand, darkLight, primary, tertiary } = Colors;

const Welcome = () => {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.navigate("Login");
    };

    return (
        <StyledContainer>
            <InnerContainer>
                <PageTitle>Welcome to PC Doctor</PageTitle>
                <SubTitle>We Provide PC Tips for your Broken PC.</SubTitle>
                <View style={{ marginTop: 50, width:'90%'}}>
                    <StyledButton onPress={handleLogout}>
                        <ButtonText>Logout</ButtonText>
                    </StyledButton>
                </View>

            </InnerContainer>
        </StyledContainer>
        
    );
}

export default Welcome;