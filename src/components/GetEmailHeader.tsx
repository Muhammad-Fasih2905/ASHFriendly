import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GetEmailHeaderProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const GetEmailHeader: React.FC<GetEmailHeaderProps> = ({navigation}) => {
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
      <Text style={styles.title}>Forgot Password?</Text>
    </View>
  );
};

export default GetEmailHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: verticalScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    gap: 85,
    borderBottomWidth: 1,
    borderColor: Colors.lightestGrey,
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginLeft: moderateScale(15),
  },
});
