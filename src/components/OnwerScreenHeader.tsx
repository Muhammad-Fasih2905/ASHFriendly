import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { OwnerScreenHeaderProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const OwnerScreenHeader: React.FC<OwnerScreenHeaderProps> = ({
  navigation,
  title,
  backArrow = true,
  headerStyle,
  insideEstablishment,
  uploadPhotos,
  titleSty,
}) => {
  const handleBack = () => {
    if (insideEstablishment || uploadPhotos) {
      navigation.navigate('dashboard');
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={StyleSheet.flatten([styles.header, headerStyle])}>
      {backArrow && (
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
      )}
      <Text style={[styles.title, titleSty]}>{title}</Text>
    </View>
  );
};

export default OwnerScreenHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: verticalScale(10),
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    gap: 85,
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginLeft: moderateScale(15),
    fontWeight: 'bold',
  },
});
