import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { UserHeaderProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const UserHeaderComponent: React.FC<UserHeaderProps> = ({
  ConvertToSpeech,
  isSpeaking,
  isListening,
  handleListening,
  title,
  headerStyle,
  backArrow,
  rightArrow,
  propTextStyle,
  arrowColor = Colors.blackColor,
}) => {
  const navigation = useNavigation();
  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };
  return (
    <View style={[styles.headerContainer, headerStyle]}>
      <View style={styles.conditionHeader}>
        {backArrow && (
          <Pressable
            onPress={handleBack}
            style={{alignItems: 'flex-start', alignSelf: 'flex-start'}}>
            <GlobalIcon
              library="Ionicons"
              name="arrow-back"
              size={24}
              color={arrowColor}
            />
          </Pressable>
        )}
        <Text style={[styles.conditionTitle, propTextStyle]}>{title}</Text>
        {rightArrow && (
          <Pressable onPress={handleListening}>
            <GlobalIcon
              library="CustomIcon"
              name="Vector-2"
              size={27}
              color={isListening ? Colors.greenColor : Colors.redColor}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default UserHeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(17),
    borderBottomColor: Colors.lightGreyColor,
    borderBottomWidth: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(12),
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
