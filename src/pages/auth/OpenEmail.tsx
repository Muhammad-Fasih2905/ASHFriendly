import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Email from '../../assets/images/email.svg';
import CustomButton from '../../components/CustomButton';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
const OpenEmail = () => {
  const navigation = useNavigation();
  const openGmail = async () => {
    const gmailUrl =
      'mailto:?subject=Password Reset&body=Please check your email for further instructions.';
    const gmailWebUrl = 'https://mail.google.com/mail';
    try {
      const supported = await Linking.canOpenURL(gmailUrl);
      if (supported) {
        await Linking.openURL(gmailUrl);
      } else {
        await Linking.openURL(gmailWebUrl);
      }
    } catch (error) {
      console.error('An error occurred while opening Gmail:', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Email />
        <Text style={styles.emailTitle}>Check your Email</Text>
        <Text style={styles.para}>
          We have sent password reset instructions to your email
        </Text>
        <CustomButton
          title="Open Email"
          onPress={openGmail}
          buttonStyle={styles.signInButton}
          textStyle={styles.signInButtonText}
        />
        <Pressable onPress={() => navigation.navigate('login')}>
          <Text style={styles.footerText}>Skip I’ll confirm later</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default OpenEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
    padding: moderateScale(20),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  signInButton: {
    backgroundColor: Colors.blackColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    height: verticalScale(50),
    width: '100%',
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  emailTitle: {
    fontFamily: Fonts.InterBold,
    fontSize: moderateScale(18),
    color: Colors.blackColor,
  },
  para: {
    fontFamily: Fonts.InterMedium,
    fontSize: moderateScale(16),
    color: Colors.greyColor,
    lineHeight: 24,
    textAlign: 'center',
  },
  footerText: {
    fontFamily: Fonts.InterMedium,
    fontSize: moderateScale(16),
    color: Colors.greyColor,
  },
});
