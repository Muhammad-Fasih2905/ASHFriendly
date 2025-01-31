import React from 'react';
import { StyleSheet, View } from 'react-native';
import PagesLogo from '../assets/images/ashFriendlyLogo.svg';
import { LogoComponentProps } from '../interfaces/Interfaces';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';

const { verticalScale } = SizeMattersConfig;
const LogoComponent: React.FC<LogoComponentProps> = ({ width = 100, height = 100, style }) => {
    return (
        <View style={[styles.logoContainer, style]}>
            <PagesLogo width={width} height={height} />
        </View>
    );
};

export default LogoComponent;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginVertical: verticalScale(25),
    },
});
