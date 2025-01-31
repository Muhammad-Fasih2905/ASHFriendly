import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CustomButtonProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  leftIcon,
  rightIcon,
  isLoading,
  disabled = false,
}) => {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.button, buttonStyle]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size={'small'} color={Colors.whiteColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(24),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(10),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: moderateScale(8),
  },
  iconRight: {
    marginLeft: moderateScale(8),
  },
  text: {
    color: Colors?.blackColor,
  },
});
