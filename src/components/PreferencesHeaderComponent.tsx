import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { PreferencesHeaderProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const PreferencesHeaderComponent: React.FC<PreferencesHeaderProps> = ({
  navigation,
  title,
}) => {
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBack}
        style={{alignItems: 'flex-start', alignSelf: 'flex-start'}}>
        <GlobalIcon
          library="Ionicons"
          name="arrow-back"
          size={24}
          color={Colors.blackColor}
        />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default PreferencesHeaderComponent;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: verticalScale(30),
    width: '100%',
    marginVertical: verticalScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: verticalScale(12),
    alignItems: 'center',
    gap: 85,
    borderBottomColor: Colors.lightGreyColor,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginLeft: moderateScale(15),
  },
});
