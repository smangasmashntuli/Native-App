// style.js
import styled from 'styled-components/native';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Colors = {
    primary: "#050505",
    secondary: "#090909",
    tertiary: "#FFFFFF",
    darkLight: "#70747C",
    brand: "#B6D96B",
    border: "#242424",
    warning: "#D9B95B",
    green: "#10B981",
    red: "#EF4444",
    // Extra dark-theme tokens (safe to use alongside the originals)
    background: "#050505",
    surfaceAlt: "#0D0D0D",
    textSecondary: "#B9BDC4",
    teal: "#B6D96B",
    onBrand: "#FFFFFF",
};

const { primary, secondary, tertiary, darkLight, brand, border, warning, green, red } = Colors;

/**
 * Root screen container. Renders the signature dark vertical gradient used
 * throughout the Inspo design. Accepts children and an optional style so it
 * stays a drop-in replacement for the original styled.View.
 */
export const StyledContainer = ({ children, style }) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#050505', '#050505']}
            locations={[0, 1]}
            style={[
                {
                    flex: 1,
                    padding: 25,
                    paddingTop: insets.top + 10,
                    paddingBottom: insets.bottom + 10,
                    backgroundColor: '#050505',
                },
                style,
            ]}
        >
            {children}
        </LinearGradient>
    );
};

export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
`;
export const PageLogo = styled.Image`
    width: 250px;
    height: 200px;
    align-self: center;
`;

export const PageTitle = styled.Text`
    font-size: 27px;
    text-align: left;
    font-weight: 600;
    color: ${tertiary};
    padding: 0;
    margin-bottom: 12px;
`;

export const SubTitle = styled.Text`
    font-size: 14px;
    text-align: left;
    margin-bottom: 24px;
    font-weight: 400;
    color: ${darkLight};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 12px;
    padding-left: 44px;
    padding-right: 44px;
    border-radius: 6px;
    border-width: 1px;
    border-color: ${border};
    font-size: 13px;
    height: 43px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${darkLight};
    font-size: 11px;
    text-align: left;
    margin-bottom: 5px;
    font-weight: 400;
`;


export const LeftIcon = styled.View`
    position: absolute;
    top: 18px;
    left: 15px;
    z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
    position: absolute;
    top: 18px;
    left: 15px;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    height: 43px;
`;

export const ButtonText = styled.Text`
    color: #050505;
    font-size: 12px;
    font-weight: 600;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-content: center;
    color: ${darkLight};
    font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand};
    font-size: 12px;
    font-weight: 600;
`;