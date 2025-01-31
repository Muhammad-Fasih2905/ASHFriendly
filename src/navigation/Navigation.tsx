import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import SplashScreen from '../spalashScreen/SplashScreen';
import { useAppSelector } from '../store/hooks';
import { AppStack, AuthStack } from './Stacks';

const Navigation = () => {
    const token = useAppSelector(state => state.userSlice.token);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <NavigationContainer>
            {loading ? <SplashScreen /> : token ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default Navigation