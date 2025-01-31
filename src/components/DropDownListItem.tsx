import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
export const DropdownItem: React.FC<{
  label: string;
  value: string;
  onPress: () => void;
}> = ({label, value, onPress}) => (
  <View style={styles.dropdownItem}>
    <Text style={styles.label}>{label}</Text>
    <Pressable style={styles.dropdown} onPress={onPress}>
      <Text style={styles.dropdownText}>{value}</Text>
      <GlobalIcon name="chevron-down" size={16} color={Colors.greyColor} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  dropdownItem: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    height: verticalScale(45),
    paddingHorizontal: moderateScale(12),
    borderColor: Colors.lightGreyColor,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.blackColor,
  },
});
