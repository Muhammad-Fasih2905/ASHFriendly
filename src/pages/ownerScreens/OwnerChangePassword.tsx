import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changePassword } from '../../store/user/UserAction';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
const OwnerChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [userRole, setUserRole] = useState<string>('');
  AsyncStorage.getItem('userRole')
    .then(role => {
      if (role !== null) {
        setUserRole(role);
      } else {
        setUserRole('defaultRole');
      }
    })
    .catch(error => {
      console.error('Error retrieving userRole:', error);
    });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });
  const onSubmit = async (data: any) => {
    const res = await dispatch(changePassword(data)).unwrap();
    if (res?.success === true) {
      navigation.navigate('ownerSettings');
      reset();
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <UserHeaderComponent
        title={'Change Password'}
        backArrow={true}
        headerStyle={{
          ...styles.header,
          borderBottomWidth: userRole === 'User' ? 1 : 0,
        }}
        rightArrow={userRole === 'User' ? true : false}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContent}>
          <View style={styles.inputsView}>
            <Controller
              name="current_password"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Current Password is required',
                },
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="Current Password"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                  inputStyle={styles.input}
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <GlobalIcon
                        library="Feather"
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={24}
                        color={Colors.greyColor}
                      />
                    </Pressable>
                  }
                  leftIcon={
                    <GlobalIcon
                      library="CustomIcon"
                      name="lock-open"
                      size={24}
                      color={Colors.greyColor}
                    />
                  }
                  error={errors?.current_password?.message}
                />
              )}
            />
            <Controller
              name="new_password"
              control={control}
              rules={{
                required: {value: true, message: 'New Password is required'},
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="New Password"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword1}
                  inputStyle={styles.input}
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  rightIcon={
                    <Pressable onPress={() => setShowPassword1(!showPassword1)}>
                      <GlobalIcon
                        library="Feather"
                        name={showPassword1 ? 'eye' : 'eye-off'}
                        size={24}
                        color={Colors.greyColor}
                      />
                    </Pressable>
                  }
                  leftIcon={
                    <GlobalIcon
                      library="CustomIcon"
                      name="lock-open"
                      size={24}
                      color={Colors.greyColor}
                    />
                  }
                  error={errors?.new_password?.message}
                />
              )}
            />
            <Controller
              name="new_password_confirmation"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'New Password Confirmation is required',
                },
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="Re-Type New Password"
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword2}
                  inputStyle={styles.input}
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  rightIcon={
                    <Pressable onPress={() => setShowPassword2(!showPassword2)}>
                      <GlobalIcon
                        library="Feather"
                        name={showPassword2 ? 'eye' : 'eye-off'}
                        size={24}
                        color={Colors.greyColor}
                      />
                    </Pressable>
                  }
                  leftIcon={
                    <GlobalIcon
                      library="CustomIcon"
                      name="lock-open"
                      size={24}
                      color={Colors.greyColor}
                    />
                  }
                  error={errors?.new_password_confirmation?.message}
                />
              )}
            />
          </View>
          <CustomButton
            title={
              isLoading ? (
                <ActivityIndicator size="small" color={Colors.whiteColor} />
              ) : (
                'Save Changes'
              )
            }
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.signInButton}
            textStyle={styles.signInButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default OwnerChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyColor,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(20),
  },
  inputContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
  },
  inputsView: {
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.whiteColor,
    marginBottom: 1,
  },
  signInButton: {
    backgroundColor: Colors.redColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    height: verticalScale(45),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
});
