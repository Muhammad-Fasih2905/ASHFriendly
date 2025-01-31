import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AppLogo from '../assets/images/splashScreen.svg';
import { Colors } from '../utlis/Colors';
const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnimation = useRef(new Animated.Value(3)).current;
  const moveAnimation = useRef(
    new Animated.Value(heightPercentageToDP(40)),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnimation, {
        toValue: heightPercentageToDP(-10),
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
    });
  }, [fadeAnimation, moveAnimation]);
  return (
    <SafeAreaView style={styles?.mainView}>
      <Animated.View
        style={{
          opacity: fadeAnimation,
          transform: [{ translateY: moveAnimation }],
        }}>
        <AppLogo />
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.allScreensBgColor,
  },
});
