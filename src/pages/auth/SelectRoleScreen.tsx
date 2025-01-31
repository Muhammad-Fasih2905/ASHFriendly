import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import LoginLogoComponent from '../../components/LoginLogoComponent';
import { getQuestions } from '../../store/establishment/establishmentActions';
import { useAppDispatch } from '../../store/hooks';
import { saveLocation, saveLocationName, setRole } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const { moderateScale, verticalScale } = SizeMattersConfig;
const SelectRoleScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleRoleSelection = (role: string) => {
    dispatch(setRole(role));
    dispatch(saveLocationName(''));
    dispatch(saveLocation(null));
    navigation.navigate('signUp');
    role === "Owner" 
    && dispatch(getQuestions({ perPage: 4, page: 1 }));
  };

  return (
    <View style={styles.container}>
      <LoginLogoComponent style={{ marginVertical: verticalScale(26) }} />
      <View style={styles.roleButtonView}>
        <Text style={styles.selectRoleText}>Select Your Role</Text>
        <CustomButton
          title="I am a User"
          onPress={() => handleRoleSelection('User')}
          buttonStyle={styles.roleButton}
          textStyle={styles.signInButtonText}
        />
        <CustomButton
          title="I am an Establishment Owner"
          onPress={() => handleRoleSelection('Owner')}
          buttonStyle={styles.signInButton}
          textStyle={styles.signInButtonText}
        />
      </View>
    </View>
  );
};

export default SelectRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: Colors.allScreensBgColor,
  },
  signInButton: {
    backgroundColor: Colors.blackColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    width: '100%',
    height: verticalScale(50),
  },
  roleButton: {
    backgroundColor: Colors.redColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    width: '100%',
    height: verticalScale(50),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  roleButtonView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginVertical: verticalScale(27),
  },
  selectRoleText: {
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    fontSize: moderateScale(24),
    textAlign: 'center',
  },
});
