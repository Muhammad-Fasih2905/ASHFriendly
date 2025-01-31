import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';

const ViewAll = ({onPress}: any) => {
  return (
    <Pressable onPress={onPress} style={styles.ViewAllBtn}>
      <Text style={styles.viewAllText}>View All</Text>
      <GlobalIcon
        library="Entypo"
        name="chevron-small-right"
        size={25}
        color={Colors.redColor}
      />
    </Pressable>
  );
};

export default ViewAll;
const styles = StyleSheet.create({
  ViewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  viewAllText: {
    color: Colors.redColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterRegular,
  },
});
