import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
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
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditIcon from '../../assets/images/editIcon.svg';
import AppBottomSheet from '../../components/AppBottomSheet';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import DatePicker from '../../components/DatePicker';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import Tts from '../../services/textToSpeech';
import { getImage } from '../../store/common/commonActions';
import { getEstablishments } from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateOwnerProfile,
  updateProfileImage,
} from '../../store/user/UserAction';
import {
  saveLocation,
  saveLocationName,
  saveMyLocation,
} from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { initializeGeocoder } from '../../utlis/GetLocation';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(state => state.userSlice.role);
  const user: any = useAppSelector(state => state.userSlice.user);
  const location = useAppSelector(state => state.userSlice.location);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const token = useAppSelector(state => state.userSlice.token);
  const [loading, setLoading] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const selectedLocationName = useAppSelector(
    state => state.userSlice.location_name,
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['18%', '40%'], []);

  const openSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const closeSheet = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  React.useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    initializeGeocoder();
  }, []);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.user?.name || '',
      phone_number: user?.user?.phone_number || '',
      dob: user?.user?.dob || '',
      latitude: 0,
      longitude: 0,
      address: user?.user?.address,
    },
  });

  const onSubmit = async (data: any) => {
    let conditionData: any;
    let apiPath: string = '';
    if (userRole === 3) {
      conditionData = {
        name: data?.name,
        email: user?.user?.email,
        phone_number: data?.phone_number,
        dob: data?.dob,
        latitude: data?.latitude,
        longitude: data?.longitude,
        address: data?.address,
      };
      apiPath = 'user/update-profile';
    } else if (userRole === 2) {
      conditionData = {
        name: data?.name,
        phone_number: data?.phone_number,
      };
      apiPath = 'establishment/update-owner-profile';
    }
    const res = await dispatch(
      updateOwnerProfile({data: conditionData, apiPath: apiPath}),
    ).unwrap();
    if (res.success == true) {
      dispatch(saveMyLocation(location));
      dispatch(getEstablishments(token));
      navigation.goBack();
    }
  };

  const handleLocation = () => {
    const onLocationSelected = (
      latitude: number,
      longitude: number,
      address: string,
    ) => {
      setValue('latitude', latitude);
      setValue('longitude', longitude);
      setValue('address', address);
    };
    navigation.navigate('locationSelect', {
      showLocation: true,
      currentLocation: false,
      editInfo: true,
      onLocationSelected: onLocationSelected,
    });
  };

  const handleSelectImage = async (type: string) => {
    const res = await dispatch(getImage(type)).unwrap();
    if (res) {
      const formData = new FormData();
      formData.append('image', res);
      setLoading(true);
      const response = await dispatch(updateProfileImage(formData)).unwrap();
      if (response.success == true) {
        setLoading(false);
        console.log('ok', response);
      }
    }
  };

  useEffect(() => {
    if (location != null || user) {
      setValue('latitude', location?.latitude || user?.user?.latitude);
      setValue('longitude', location?.longitude || user?.user?.longitude);
      if (selectedLocationName) {
        setValue('address', selectedLocationName);
      }
    }
  }, [selectedLocationName]);

  useEffect(() => {
    return () => {
      dispatch(saveLocationName(''));
      dispatch(saveLocation(null));
    };
  }, []);

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const fullname = watch('name') || 'no available';
      const email = user?.user?.email || 'not available';
      const phone = watch('phone_number') || 'not available';
      const dob = watch('dob') || 'not selected so Select your Date of birth';
      const location =
        selectedLocationName || user?.user?.address || 'not available';

      const content = `You are currently on Edit Profile Screen! 
      Here are the details: 
         ${fullname ? `The Full name is ${fullname}` : ''}!
         ${email ? `The Email address is ${email}` : ''}!
         ${phone ? `The phone number is ${phone}` : ''}!
         ${dob ? `The Date of birth is ${dob}` : ''}!
         ${location ? `The location is ${location}` : ''}!
         At the bottom of the screen! we have Save Changes button`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <UserHeaderComponent
          title={userRole === 3 ? 'Edit Profile' : 'Owner’s Info'}
          backArrow={true}
          headerStyle={styles.header}
          rightArrow={userRole === 3 ? true : false}
          propTextStyle={{fontWeight: 'bold'}}
          isListening={isSpeaking}
          handleListening={() => {
            ConvertToSpeech();
          }}
        />
        <View style={styles.content}>
          <Pressable style={styles.profileInfo} onPress={() => openSheet()}>
            <Image
              style={styles.profileInfoPic}
              source={{uri: user?.user?.profile_pic}}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View style={styles.imageLoading}>
                <ActivityIndicator size="large" color={Colors.redColor} />
              </View>
            )}
            <View style={styles.iconContainer}>
              {loading ? (
                <ActivityIndicator size={'small'} color={Colors.whiteColor} />
              ) : (
                <EditIcon />
              )}
            </View>
          </Pressable>
          <View style={styles.inputView}>
            <Controller
              control={control}
              name="name"
              rules={{required: 'Full name is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  label="Full Name"
                  placeholder="Bruce Wan"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  autoCapitalize="none"
                  inputStyle={styles.input}
                  error={errors.name?.message}
                />
              )}
            />

            <InputField
              editable={false}
              label="Email Address"
              placeholder={user?.user?.email}
              value={user?.user?.email}
              onChangeText={(text: string) => console.log(text)}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="none"
              secureTextEntry={false}
              inputStyle={styles.input}
              rightIcon={
                <GlobalIcon
                  library="FontAwesome"
                  name="check-circle"
                  size={26}
                  color={Colors.greenColor}
                />
              }
            />

            <Controller
              control={control}
              name="phone_number"
              rules={{required: 'Phone number is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  label="Phone Number"
                  placeholder="+1 (027) 266-7137"
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  keyboardType="phone-pad"
                  textContentType="none"
                  secureTextEntry={false}
                  autoCapitalize="none"
                  inputStyle={styles.input}
                  error={errors.phone_number?.message}
                />
              )}
            />

            {userRole === 3 && (
              <Controller
                control={control}
                name="dob"
                rules={{required: 'Dob is required'}}
                render={({field: {value}}) => (
                  <View>
                    <Text style={styles.locationText}>Date of Birth</Text>
                    <Pressable
                      onPress={() => setTimeModal(true)}
                      style={[
                        styles.locationContainer,
                        !errors?.dob?.message && {
                          marginBottom: verticalScale(15),
                        },
                      ]}>
                      <Text style={[value != '' && {color: Colors.blackColor, fontFamily: Fonts.InterMedium}]}>
                        {value === '' ? ' Select Your Date of birth' : value}
                      </Text>
                    </Pressable>
                    {errors?.dob?.message && (
                      <Text
                        style={{
                          color: Colors.red,
                          marginBottom: verticalScale(15),
                        }}>
                        {errors?.dob?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            )}
            <DatePicker
              visiable={timeModal}
              mode={'date'}
              confirm={e => {
                console.log('date', e);
                setValue('dob', moment(e).format('YYYY-MM-DD'));
                setTimeModal(false);
              }}
              cancel={() => setTimeModal(false)}
            />
            {userRole === 3 && (
              <Controller
                control={control}
                name="address"
                render={({field: {value}}) => (
                  <View style={styles.mainView}>
                    <Text style={styles.locationText}>Location</Text>
                    <Pressable
                      style={styles.locationContainer}
                      onPress={handleLocation}>
                      <View style={styles.LoctionRightText}>
                        <GlobalIcon
                          library="CustomIcon"
                          name="location"
                          size={24}
                          color={Colors.greyColor}
                        />
                        <Text
                          numberOfLines={1}
                          style={[styles.locationText, {width: 270, fontFamily: Fonts.InterMedium}]}>
                          {value}
                        </Text>
                      </View>
                      <GlobalIcon
                        library="Ionicons"
                        name="chevron-forward"
                        size={24}
                        color={Colors.greyColor}
                      />
                    </Pressable>
                  </View>
                )}
              />
            )}
          </View>
          <CustomButton
            disabled={isLoading}
            isLoading={isLoading}
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.signInButton}
            textStyle={styles.signInButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
      <AppBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        backdropComponent={({style}) => (
          <Pressable
            onPress={() => closeSheet()}
            style={[style, {backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}
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
          style={[styles.bottomSheetTab, {marginTop: heightPercentageToDP(1)}]}>
          <Text style={styles.title}>Gallery</Text>
          <GlobalIcon
            library="MaterialCommunityIcons"
            name="camera-burst"
            color={Colors.blackColor}
          />
        </Pressable>
      </AppBottomSheet>
    </SafeAreaView>
  );
};

export default Profile;

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
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(18),
  },
  header: {
    borderBottomWidth: 0,
    marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
  },
  profileInfo: {
    width: '63%',
    height: 120,
    alignItems: 'flex-end',
  },
  profileInfoPic: {
    height: 120,
    width: 120,
    borderRadius: 100,
  },
  imageLoading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
  },
  iconContainer: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    padding: moderateScale(4),
    top: 67,
    borderWidth: 5,
    backgroundColor: Colors.redColor,
    borderColor: Colors.whiteColor,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    flex: 1,
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.whiteColor,
    marginBottom: 5,
  },
  signInButton: {
    backgroundColor: Colors.redColor,
    marginTop: verticalScale(10),
    borderRadius: 37,
    height: verticalScale(50),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
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
  LoctionRightText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: Colors.blackColor,
    // fontFamily: Fonts.InterMedium,
    fontSize: moderateScale(16),
    marginHorizontal: moderateScale(4),
    marginBottom: heightPercentageToDP(1),
  },
  mainView: {
    flexDirection: 'column',
  },
  dob: {
    width: '100%',
    height: heightPercentageToDP(6),
    borderColor: Colors.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(3),
    justifyContent: 'center',
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
});
