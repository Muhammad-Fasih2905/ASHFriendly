import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TravelModeItemProps } from '../interfaces/interfaces';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';

const TravelModeItem: React.FC<TravelModeItemProps> = ({
  icon,
  time,
  isSelected,
  onPress,
}) => (
  <Pressable
    style={[styles.travelModeItem, isSelected && styles.selectedTravelMode]}
    onPress={onPress}>
    <GlobalIcon
      library="CustomIcon"
      name={icon}
      size={24}
      color={isSelected ? Colors.redColor : Colors.blackColor}
    />
    <Text
      style={[
        styles.travelModeTime,
        isSelected && styles.selectedTravelModeTime,
      ]}>
      {time}
    </Text>
  </Pressable>
);

export default TravelModeItem;

const styles = StyleSheet.create({
  travelModeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
    height: verticalScale(25),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    gap: 5,
  },
  selectedTravelMode: {
    backgroundColor: Colors.lightestBlueColor,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    borderRadius: 28,
  },
  travelModeTime: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  selectedTravelModeTime: {
    color: Colors.redColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
  },
});
