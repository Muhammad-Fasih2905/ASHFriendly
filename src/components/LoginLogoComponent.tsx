import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginLogo from '../assets/images/loginLogo.svg';
import { LoginComponentProps } from '../interfaces/Interfaces';
import { ResponsiveSizes } from '../utlis/ResponsiveSizes';
const { hp } = ResponsiveSizes
const LoginLogoComponent: React.FC<LoginComponentProps> = ({ style }) => {
    return (
        <View style={[styles.logoContainer, style]}>
            <LoginLogo />
        </View>
    );
}

export default LoginLogoComponent;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginVertical: hp(6),
    },
});
