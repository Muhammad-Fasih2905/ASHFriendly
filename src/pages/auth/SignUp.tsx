import { BottomSheetModal } from '@gorhom/bottom-sheet';
import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import EditIcon from '../../assets/images/edit_icon.svg';
import GoogleIcon from '../../assets/images/googleIcon.svg';
import AppBottomSheet from '../../components/AppBottomSheet';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import { getImage } from '../../store/common/commonActions';
import { showMessage } from '../../store/common/commonSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signUp, socialLogin } from '../../store/user/UserAction';
import { saveLocation, saveLocationName } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { requestCameraAndGalleryPermissions } from '../../utlis/functions';
import { initializeGeocoder } from '../../utlis/GetLocation';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const { moderateScale, verticalScale } = SizeMattersConfig;
const SignUp = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const role = useAppSelector(state => {
    if (state.userSlice.role === 'User' || state.userSlice.role === 3) {
      return 'User';
    } else if (state.userSlice.role === 'Owner' || state.userSlice.role === 2) {
      return 'Owner';
    }
  });
  const location = useAppSelector(state => state.userSlice.location);
  const selectedLocationName = useAppSelector(
    state => state.userSlice.location_name,
  );
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [locationName, setLocationName] = useState<string>('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [image, setImage] = useState<null | string>(null);

  const snapPoints = useMemo(() => ['18%', '40%'], []);

  const openSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeSheet = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestCameraAndGalleryPermissions();
    if (granted) {
      console.log('You can now access the camera and gallery');
    } else {
      console.log('Permission denied');
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    initializeGeocoder();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues:
      role == 'User'
        ? {
          name: '',
          email: '',
          phone_number: '',
          password: '',
          latitude: 0,
          longitude: 0,
          address: '',
          confirm_password: '',
          role_id: 3,
        }
        : {
          name: '',
          email: '',
          phone_number: '',
          password: '',
          confirm_password: '',
          role_id: 2,
        },
  });

  useEffect(() => {
    if (location != null) {
      setValue('latitude', location?.latitude);
      setValue('longitude', location?.longitude);
      if (selectedLocationName) {
        setLocationName(selectedLocationName);
        setValue('address', selectedLocationName);
      }
    }
  }, [location]);

  const handleLocation = (setValues: any) => {
    const onLocationSelected = (
      latitude: number,
      longitude: number,
      address: string,
    ) => {
      console.log('Selected Location:', latitude, longitude);
      setValue('latitude', latitude);
      setValue('longitude', longitude);
      setValue('address', address);
      setValues(latitude);
    };
    navigation.navigate('locationSelect', {
      showLocation: true,
      currentLocation: false,
      onLocationSelected: onLocationSelected,
    });
  };
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo: any = await GoogleSignin.signIn();
      if (userInfo.type != 'cancelled') {
        dispatch(
          socialLogin({
            code: userInfo.data.serverAuthCode,
            type: 'google',
            role_id: role == 'User' ? 3 : 2,
          }),
        );
      }
    } catch (error) {
      console.log('Error during sign-in:', error, statusCodes);
    }
  };
  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const { user, email, fullName, identityToken, authorizationCode } =
        appleAuthRequestResponse;
      const credentialState = await appleAuth.getCredentialStateForUser(user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        if (identityToken) {
          if (email == null) {
            const jsonString: any = jwtDecode(identityToken);
            dispatch(
              socialLogin({
                email: jsonString?.email,
                code: authorizationCode,
                type: 'apple',
                role_id: role == 'User' ? 3 : 2,
              }),
            );
          } else {
            dispatch(
              socialLogin({
                email: email,
                code: authorizationCode,
                type: 'apple',
                role_id: null,
              }),
            );
          }
        }
      } else {
        console.log('User is not authorized');
      }
    } catch (error) {
      console.log(error, '==> error');
    }
  };

  const onSubmit = async (data: any) => {
    if (image == null) {
      dispatch(showMessage('Image is required'));
      return;
    }
    let location = {
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone_number', data.phone_number);
    formData.append('password', data.password);
    formData.append('confirm_password', data.confirm_password);
    formData.append('role_id', data.role_id);
    console.log(data.address, 'address');
    if (
      location.latitude != null &&
      location.longitude != null &&
      data.address
    ) {
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('address', data.address);
    }
    formData.append('profile_pic', image);

    const res = await dispatch(signUp(formData)).unwrap();
    if (res?.success == true) {
      if (res.data?.user?.role_id == 2) {
        navigation.navigate('establishmentDetails', {
          insideEstablishment: false,
        });
      } else {
        navigation.navigate('preferencesSetup');
      }
      reset();
      setImage(null);
      setLocationName('Location');
      dispatch(saveLocation(null));
      dispatch(saveLocationName(''));
    }
  };

  const handleSelectImage = async (type: string) => {
    try {
      const res = await dispatch(getImage(type)).unwrap();
      if (res) {
        setImage(res);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarAndTextView}>
          <Pressable onPress={() => openSheet()}>
            <Image
              style={{
                height: heightPercentageToDP(15),
                width: heightPercentageToDP(15),
                borderRadius: 100,
              }}
              source={
                image != null
                  ? { uri: image?.uri }
                  : require('../../assets/images/user_profile.png')
              }
            />
            <View style={{ position: 'absolute', right: -5, top: 5 }}>
              <EditIcon />
            </View>
          </Pressable>
          {role === 'User' ? (
            <Text style={styles.SignUpTitle}>Create an Account</Text>
          ) : (
            <Text style={{ ...styles.SignUpTitle, fontFamily: Fonts.InterBold }}>
              Get Started
            </Text>
          )}
        </View>
        <View style={styles.inputView}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: { value: true, message: 'Name is required' },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder={
                  role == 'User' ? 'Full Name' : "Business Owner's Name"
                }
                value={value}
                onChangeText={onChange}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                secureTextEntry={false}
                inputStyle={styles.input}
                leftIcon={
                  <GlobalIcon
                    library="FontAwesome6"
                    name="user"
                    size={24}
                    color={Colors.greyColor}
                  />
                }
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: { value: true, message: 'Email is required' },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
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
            name="phone_number"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Phone number is required',
              },
              maxLength: {
                value: 15,
                message: 'Phone number should be 10-15 numbers',
              },
              minLength: {
                value: 10,
                message: 'Phone number should be 10-15 numbers',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="Phone Number"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                secureTextEntry={false}
                inputStyle={styles.input}
                leftIcon={
                  <GlobalIcon
                    library="CustomIcon"
                    name="Phone"
                    size={24}
                    color={Colors.greyColor}
                  />
                }
                error={errors.phone_number?.message}
              />
            )}
          />

          {role === 'User' && (
            <Controller
              name={'latitude'}
              control={control}
              rules={{
                required: { value: true, message: 'Location is required' },
              }}
              render={({ field: { onChange, value } }) => (
                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={[
                      styles.locationContainer,
                      {
                        marginBottom:
                          !errors.latitude?.message || value
                            ? verticalScale(20)
                            : verticalScale(30),
                      },
                    ]}
                    onPress={() => handleLocation(onChange)}>
                    <GlobalIcon
                      library="CustomIcon"
                      name="location"
                      size={24}
                      color={Colors.greyColor}
                    />
                    {locationName ? (
                      <Text
                        style={[styles.input, styles.locationText]}
                        numberOfLines={1}>
                        {locationName}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.input,
                          styles.locationText,
                          {
                            color: Colors.greyColor,
                            fontFamily: Fonts.InterMedium,
                          },
                        ]}
                        numberOfLines={1}>
                        Location
                      </Text>
                    )}
                    <GlobalIcon
                      library="Ionicons"
                      name="chevron-down"
                      size={24}
                      color={Colors.greyColor}
                    />
                  </Pressable>
                  {errors.latitude?.message && !value && (
                    <Text
                      style={{
                        color: Colors.red,
                        marginBottom: verticalScale(15),
                        position: 'absolute',
                        bottom: -0,
                      }}>
                      {errors.latitude?.message}
                    </Text>
                  )}
                </View>
              )}
            />
          )}

          <Controller
            name="password"
            control={control}
            rules={{
              required: { value: true, message: 'Password is required' },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                inputStyle={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                leftIcon={
                  <GlobalIcon
                    library="CustomIcon"
                    name="lock-open"
                    size={24}
                    color={Colors.greyColor}
                  />
                }
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
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={control}
            rules={{
              required: { value: true, message: 'Confirm password is required' },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder="Confirm Password"
                value={value}
                onChangeText={onChange}
                autoCorrect={false}
                autoCapitalize="none"
                textContentType="none"
                secureTextEntry={!showPassword1}
                inputStyle={styles.input}
                leftIcon={
                  <GlobalIcon
                    library="CustomIcon"
                    name="lock-open"
                    size={24}
                    color={Colors.greyColor}
                  />
                }
                rightIcon={
                  <Pressable onPress={() => setShowPassword1(!showPassword1)}>
                    <GlobalIcon
                      library={showPassword1 ? 'Feather' : 'Feather'}
                      name={showPassword1 ? 'eye' : 'eye-off'}
                      size={20}
                      color={Colors.greyColor}
                    />
                  </Pressable>
                }
                error={errors.confirm_password?.message}
              />
            )}
          />

          <CustomButton
            title={
              isLoading ? (
                <ActivityIndicator size="small" color={Colors.whiteColor} />
              ) : (
                'Continue'
              )
            }
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.signInButton}
            textStyle={styles.signInButtonText}
          />
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
            <Text style={styles.dontHaveAccount}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('login')}>
              <Text style={styles.signUpText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <AppBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={({ style }) => (
          <Pressable
            onPress={() => closeSheet()}
            style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}
          />
        )}>
        <Pressable
          onPress={() => {
            closeSheet();
            handleSelectImage('camera');
          }}
          style={styles.bottomSheetTab}>
          <Text style={styles.title}>Camera</Text>
          <GlobalIcon
            library="AntDesign"
            name="camera"
            color={Colors.blackColor}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            closeSheet();
            handleSelectImage('gallery');
          }}
          style={[styles.bottomSheetTab, { marginTop: heightPercentageToDP(1) }]}>
          <Text style={styles.title}>Gallery</Text>
          <GlobalIcon
            library="MaterialCommunityIcons"
            name="camera-burst"
            color={Colors.blackColor}
          />
        </Pressable>
      </AppBottomSheet>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: Colors.allScreensBgColor,
  },
  scrollView: {
    flexGrow: 1,
  },
  inputView: {
    flex: 1,
    flexDirection: 'column',
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
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(16),
    backgroundColor: Colors.whiteColor,
    height: verticalScale(45),
  },
  locationText: {
    color: Colors.blackColor,
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(12),
  },
  SignUpTitle: {
    fontSize: moderateScale(24),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    textAlign: 'center',
  },
  avatarAndTextView: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: verticalScale(14),
    gap: 30,
    paddingTop: Platform.OS == 'ios' ? verticalScale(22) : 0,
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
  bottomSheetTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: heightPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1),
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  icon: { width: 50, height: 50 },
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
});
