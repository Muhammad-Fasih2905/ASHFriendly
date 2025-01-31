import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppDropdown from '../../components/AppDropdown';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import UserHeaderComponent from '../../components/GlobalHeaderComponent';
import { showMessage } from '../../store/common/commonSlice';
import {
  addEstablishmentDetails,
  getEstablishmentDetails,
  getEstablishmentTypes,
  updateEstablishmentDetails,
} from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsLogin, setSignupToken } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { convert_data } from '../../utlis/functions';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
const {moderateScale, verticalScale} = SizeMattersConfig;
Geocoder.init('AIzaSyDbOfusA5U9qee5ZPfNOTO82OH3an23m0g');
const EstablishmentDetails = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route: any = useRoute();
  const insideEstablishment = route?.params?.insideEstablishment;
  const token = useAppSelector(state => state.userSlice.token);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const location = useAppSelector(state => state.userSlice.location);
  const ownerEstablishmentDetails: any = useAppSelector(
    state => state.establishmentSlice.ownerEstablishmentDetails,
  );
  const location_name = useAppSelector(state => state.userSlice.location_name);
  const establishmentTypes = useAppSelector(
    state => state.establishmentSlice.establishmentTypes,
  );
  const [estTypes, setEstTypes] = useState([]);
  const [matchingNames, setMatchingNames] = useState('');

  useEffect(() => {
    dispatch(getEstablishmentTypes());
    if (token) {
      dispatch(getEstablishmentDetails());
    }
  }, []);

  useEffect(() => {
    if (establishmentTypes?.length > 0) {
      setEstTypes(convert_data(establishmentTypes));
    }
  }, [establishmentTypes]);

  const handleLocation = () => {
    const onLocationSelected = (
      latitude: number,
      longitude: number,
      address: string,
    ) => {
      setValue('latitude', latitude);
      setValue('longitude', longitude);
      setValue('location', address);
    };
    navigation.navigate('locationSelect', {
      showLocation: true,
      currentLocation: false,
      onLocationSelected: onLocationSelected,
    });
  };

  useEffect(() => {
    setValue('name', ownerEstablishmentDetails?.name);
    setValue('address_line1', ownerEstablishmentDetails?.address_line1);
    setValue('address_line2', ownerEstablishmentDetails?.address_line2);
    setValue('phone_number', ownerEstablishmentDetails?.phone_number);
    setValue('latitude', ownerEstablishmentDetails?.latitude);
    setValue('longitude', ownerEstablishmentDetails?.longitude);
    setValue('location', ownerEstablishmentDetails?.location);
    if (ownerEstablishmentDetails?.establishment_type_id && estTypes.length) {
      const matchedLabel = estTypes.find(
        type =>
          String(type.value) ===
          String(ownerEstablishmentDetails.establishment_type_id),
      )?.label;
      setValue(
        'establishment_type_id',
        ownerEstablishmentDetails?.establishment_type_id,
      );
      setMatchingNames(matchedLabel || '');
    }
  }, [ownerEstablishmentDetails]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      establishment_type_id: '',
      name: '',
      address_line1: '',
      address_line2: '',
      phone_number: '',
      latitude: '',
      longitude: '',
      location: '',
    },
  });

  useEffect(() => {
    setValue('latitude', location?.latitude);
    setValue('longitude', location?.longitude);
    setValue('location', location_name);
  }, [location, location_name]);

  const onSubmit = async (data: any) => {
    console.log('data ==>', data);
    if (data.latitude == '' || data.longitude == '') {
      showMessage('Location is Required');
      return;
    }
    let res;
    if (token) {
      dispatch(setSignupToken(null));
      res = await dispatch(updateEstablishmentDetails(data)).unwrap();
    } else {
      res = await dispatch(addEstablishmentDetails(data)).unwrap();
    }
    if (res.success == true) {
      if (insideEstablishment || token) {
        navigation.goBack();
      } else {
        navigation.navigate('uploadYourPhotosScreen');
      }
      dispatch(setIsLogin(false));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <UserHeaderComponent
          title="Establishment Details"
          backArrow={true}
          headerStyle={{
            borderBottomWidth: 0,
            marginTop: Platform.OS == 'ios' ? verticalScale(-10) : 0,
          }}
        />
        <View style={styles.inputView}>
          <View style={styles.mainInputView}>
            <Text style={styles.inputText}>Establishment Name</Text>
            <Controller
              name="name"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Establishment name is required',
                },
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  placeholder="Establishment Name"
                  value={value}
                  onChangeText={text => onChange(text)}
                  inputStyle={styles.input}
                  keyboardType="default"
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  secureTextEntry={false}
                  error={errors.name?.message}
                />
              )}
            />
          </View>
          <View style={styles.mainInputView}>
            <Controller
              name="establishment_type_id"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Establishment type is required',
                },
              }}
              render={({field: {onChange, value}}) => (
                <AppDropdown
                  label="Establishment Type"
                  placeholder={matchingNames ? matchingNames : 'select item'}
                  data={estTypes}
                  labelStyle={{fontFamily: Fonts.InterBold}}
                  onChangeText={(text: any) => onChange(Number(text.value))}
                  error={errors.establishment_type_id?.message}
                  placeholderStyle={{color: Colors.greyColor}}
                />
              )}
            />
          </View>
          <View style={{...styles.mainInputView, marginTop: verticalScale(20)}}>
            <Text style={styles.inputText}>Phone Number</Text>
            <Controller
              name="phone_number"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Phone number is required',
                },
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  value={value}
                  onChangeText={text => onChange(text)}
                  placeholder="+1 (027) 266-7137"
                  inputStyle={styles.input}
                  keyboardType="numeric"
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="none"
                  secureTextEntry={false}
                  error={errors.phone_number?.message}
                />
              )}
            />
          </View>
          <Controller
            name="location"
            control={control}
            render={({field: {value}}) => (
              <View style={styles.mainInputView}>
                <Text style={styles.inputText}>Location</Text>
                <Pressable
                  style={styles.locationContainer}
                  onPress={handleLocation}>
                  {value ? (
                    <Text
                      style={[styles.input, styles.locationText]}
                      numberOfLines={1}>
                      {value}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.input,
                        styles.locationText,
                        {color: Colors.greyColor},
                      ]}
                      numberOfLines={1}>
                      Location
                    </Text>
                  )}
                  <GlobalIcon
                    library="Entypo"
                    name="chevron-small-right"
                    size={24}
                    color={Colors.greyColor}
                  />
                </Pressable>
              </View>
            )}
          />
          <View
            style={{
              ...styles.mainInputView,
              top: 21,
              marginBottom: verticalScale(15),
            }}>
            <Text style={styles.inputText}>Establishment Address</Text>
            <View>
              <View style={{marginBottom: verticalScale(8)}}>
                <Controller
                  name="address_line1"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Address line 1 is required',
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <InputField
                      value={value}
                      onChangeText={text => onChange(text)}
                      placeholder="Address Line 1"
                      inputStyle={styles.input}
                      keyboardType="default"
                      autoCorrect={false}
                      autoCapitalize="none"
                      textContentType="none"
                      secureTextEntry={false}
                      error={errors.address_line1?.message}
                    />
                  )}
                />
              </View>
              <Controller
                name="address_line2"
                control={control}
                render={({field: {onChange, value}}) => (
                  <InputField
                    value={value}
                    onChangeText={text => onChange(text)}
                    placeholder="Address Line 2"
                    inputStyle={styles.input}
                    keyboardType="default"
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="none"
                    secureTextEntry={false}
                    error={errors.address_line2?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>
        <CustomButton
          disabled={isLoading}
          isLoading={isLoading}
          title={insideEstablishment ? 'Save Changes' : 'Continue'}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={{
            ...styles.signInButton,
            backgroundColor: insideEstablishment
              ? Colors.redColor
              : Colors.blackColor,
          }}
          textStyle={styles.signInButtonText}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EstablishmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
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
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    backgroundColor: Colors.whiteColor,
    height: verticalScale(45),
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.whiteColor,
    marginVertical: verticalScale(1),
  },
  inputText: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
    paddingHorizontal: moderateScale(2),
  },
  mainInputView: {
    flexDirection: 'column',
    paddingHorizontal: moderateScale(20),
    gap: 10,
  },
  mainViewinput: {
    flex: 1,
    flexDirection: 'column',
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
    fontFamily: Fonts.InterMedium,
    fontSize: moderateScale(14),
  },
  signInButton: {
    backgroundColor: Colors.blackColor,
    marginTop: verticalScale(10),
    borderRadius: 60,
    height: verticalScale(40),
    width: '90%',
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  signInButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
});
