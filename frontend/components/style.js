// style.js
import styled from 'styled-components/native';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Colors = {
    primary: "#0E0F11",     // app background (was light grey)
    secondary: "#17191D",   // surface / cards (was white)
    tertiary: "#FFFFFF",    // primary text (was black)
    darkLight: "#8A9099",   // muted text (was black)
    brand: "#2FB8FF",       // accent cyan (was blue)
    border: "#23272C",      // hairline borders (was light grey)
    warning: "#FFD52C",
    green: "#10B981",
    red: "#EF4444",
    // Extra dark-theme tokens (safe to use alongside the originals)
    background: "#0E0F11",
    surfaceAlt: "#14171B",
    textSecondary: "#C6CBD2",
    teal: "#9EECD9",
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
            colors={['#111417', '#0B0D0F', '#070809']}
            locations={[0, 0.5, 1]}
            style={[
                {
                    flex: 1,
                    padding: 25,
                    paddingTop: insets.top + 10,
                    paddingBottom: insets.bottom + 10,
                    backgroundColor: '#0E0F11',
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
    font-size: 32px;
    text-align: center;
    font-weight: bold;
    color: ${tertiary};
    padding: 10px;
`;

export const SubTitle = styled.Text`
    font-size: 17px;
    text-align: center;
    margin-bottom: 24px;
    letter-spacing: 0.5px;
    font-weight: 600;
    color: ${darkLight};
`;

export const StyledFormArea = styled.View`
    width: 90%;
`;

export const StyledTextInput = styled.TextInput`
    background-color: ${secondary};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 16px;
    border-width: 1px;
    border-color: ${border};
    font-size: 16px;
    height: 60px;
    margin-vertical: 3px;
    margin-bottom: 10px;
    color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
    color: ${darkLight};
    font-size: 13px;
    text-align: left;
    margin-bottom: 5px;
    font-weight: 600;
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
    background-color: ${brand};
    padding: 15px;
    border-radius: 40px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    height: 60px;
    shadow-color: #2FB8FF;
    shadow-opacity: 0.45;
    shadow-radius: 18px;
    shadow-offset: 0px 6px;
    elevation: 8;
`;

export const ButtonText = styled.Text`
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
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
    font-size: 15px;
    font-weight: bold;
`;