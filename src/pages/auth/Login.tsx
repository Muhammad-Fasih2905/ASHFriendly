import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GoogleIcon from '../../assets/images/googleIcon.svg';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import LoginLogoComponent from '../../components/LoginLogoComponent';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, socialLogin } from '../../store/user/UserAction';
import { setIsLogin } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
const Login = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const loading = useAppSelector(state => state.commonSlice.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data, 'data');
    const res = await dispatch(login(data)).unwrap();
    if (res) {
      dispatch(setIsLogin(true));
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '981782621451-83r5e6kvmiavmm1h16ssrl2fmk57s5qd.apps.googleusercontent.com',
      iosClientId:
        '981782621451-9h1knke5saulmulqlfq4kkfkv5kvq3f5.apps.googleusercontent.com',
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo: any = await GoogleSignin.signIn();
      if (userInfo.type != 'cancelled') {
        dispatch(
          socialLogin({code: userInfo.data.serverAuthCode, type: 'google', role_id: null}),
        );
      }
    } catch (error) {
      console.log('Error during sign-in:', error, statusCodes);
    }
  };
  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({ requestedOperation: appleAuth.Operation.LOGIN, requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL] })
      const {user, email, fullName, identityToken, authorizationCode} =
        appleAuthRequestResponse;
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (identityToken) { 
          if(email == null){ 
            const jsonString: any = jwtDecode(identityToken);  
            console.log(jsonString?.email, "===> jsonString?.email");
            console.log(authorizationCode, "===> authorizationCode");
            dispatch(socialLogin({email: jsonString?.email, code: authorizationCode, type: 'apple', role_id: null}));
          }else{
            dispatch(socialLogin({email: email, code: authorizationCode, type: 'apple', role_id: null}));
          }
        }
      } else {
        console.log('User is not authorized');
      }
    } catch (error) {
      console.log(error, '==> error');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <LoginLogoComponent />
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Hi, Welcome back sign in to your account
          </Text>
          <View style={styles.inputView}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: {value: true, message: 'Email is required'},
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="Email"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  secureTextEntry={false}
                  inputStyle={styles.input}
                  leftIcon={
                    <GlobalIcon
                      library="CustomIcon"
                      name="mail"
                      size={24}
                      color={Colors.greyColor}
                    />
                  }
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: {value: true, message: 'Password is required'},
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="Password"
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
                        library={showPassword ? 'Feather' : 'Feather'}
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
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
                  error={errors.password?.message}
                />
              )}
            />
            <CustomButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.signInButton}
              textStyle={styles.signInButtonText}
              isLoading={loading}
            />
          </View>

          <Pressable onPress={() => navigation.navigate('getAEmail')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>

          <Text style={styles.orContinueWith}>Or Continue with</Text>

          <View style={styles.socialButtonsContainer}>
            {Platform.OS == 'ios' ? (
              <Pressable
                onPress={handleGoogleLogin}
                style={styles.socialButton}>
                <Image
                  resizeMode="contain"
                  source={require('../../assets/images/googleCta.png')}
                  style={styles.icon}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={handleGoogleLogin}
                style={styles.socialButton}>
                <GoogleIcon />
              </Pressable>
            )}

            {Platform.OS === 'ios' && (
              <Pressable
                style={styles.socialButton}
                onPress={onAppleButtonPress}>
                <GlobalIcon
                  library="AntDesign"
                  name="apple1"
                  size={24}
                  color={Colors.blackColor}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.dontHaveAccount}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('selectRole')}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(20),
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(47),
  },
  logoText: {
    fontSize: moderateScale(18),
    color: Colors.blackColor,
    marginTop: verticalScale(10),
    fontFamily: Fonts.InterMedium,
  },
  title: {
    fontSize: moderateScale(24),
    color: Colors.blackColor,
    marginBottom: verticalScale(10),
    fontFamily: Fonts.InterBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    marginBottom: verticalScale(20),
    textAlign: 'center',
    fontFamily: Fonts.InterMedium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(16),
    backgroundColor: Colors.whiteColor,
    height: verticalScale(45),
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.whiteColor,
    marginBottom: ResponsiveSizes.hp(0.5),
  },
  signInButton: {
    backgroundColor: Colors.blackColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    height: verticalScale(50),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  forgotPassword: {
    color: Colors.blackColor,
    textAlign: 'center',
    marginTop: verticalScale(15),
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
  },
  orContinueWith: {
    textAlign: 'center',
    color: Colors.blackColor,
    marginVertical: verticalScale(20),
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  icon: {width: 50, height: 50},
  socialButton: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: moderateScale(10),
    backgroundColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dontHaveAccount: {
    color: Colors.blackColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  signUpText: {
    color: Colors.redColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  scrollView: {
    flexGrow: 1,
  },
  inputView: {
    padding: moderateScale(20),
  },
});
