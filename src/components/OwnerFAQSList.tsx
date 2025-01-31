import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { FAQItemProps } from '../interfaces/Interfaces';
import { Colors } from '../utlis/Colors';
import { Fonts } from '../utlis/GlobalFonts';
import GlobalIcon from '../utlis/GlobalIcon';
import { SizeMattersConfig } from '../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
export const FAQItem: React.FC<{
  item: FAQItemProps;
  isOpen: boolean;
  onToggle: () => void;
}> = ({item, isOpen, onToggle}) => (
  <View style={styles.faqItem}>
    <Pressable onPress={onToggle} style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      <GlobalIcon
        library="Entypo"
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={moderateScale(24)}
        color={Colors.greyColor}
      />
    </Pressable>
    {isOpen && <Text style={styles.answerText}>{item.answer}</Text>}
  </View>
);

const styles = StyleSheet.create({
  faqItem: {
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(8),
    backgroundColor: Colors.whiteColor,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  questionText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterRegular,
  },
  answerText: {
    fontSize: moderateScale(14),
    padding: moderateScale(16),
    color: Colors.greyColor,
    fontFamily: Fonts.InterRegular,
  },
});
