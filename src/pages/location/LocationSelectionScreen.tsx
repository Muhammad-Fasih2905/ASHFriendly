import Geolocation from '@react-native-community/geolocation';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import FilterIcon from '../../assets/images/filterIcon.svg';
import CustomButton from '../../components/CustomButton';
import Tts from '../../services/textToSpeech';
import { showMessage } from '../../store/common/commonSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { saveLocation, saveLocationName } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { getAddressFromCoordinates } from '../../utlis/GetLocation';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const { moderateScale, verticalScale } = SizeMattersConfig;
const { wp, hp } = ResponsiveSizes;

const LocationSelectionScreen = ({ route }: any) => {
  const [region, setRegion] = useState({
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const EditProp = route?.params?.editInfo;
  const { onLocationSelected } = route.params ?? {};
  const showLocation = route?.params?.showLocation;

  const mapRef = useRef(null);
  const placesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const userRole = useAppSelector(state => state.userSlice.role);
  const location = useAppSelector(state => state.userSlice.location);
  const locationName = useAppSelector(state => state.userSlice.location_name);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [address, setAddress] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        Tts.stop();
        clearSearch();
      };
    }, []),
  );

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    console.log("speech end");
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const spokenText = event.value[0];
    setAddress(spokenText);
    if (placesRef.current) {
      console.log('truuuu');
      placesRef.current.setAddressText(spokenText);
      getCoordinates(spokenText);
    }
  };

  const onSpeechError = (e: any) => {
    setIsListening(false);
    if (e.error?.code === '7') {
      console.log('No match found. Please speak more clearly.');
      dispatch(showMessage('No match found. Please speak more clearly.'));
    } else if (e.error?.code === '5') {
      console.log('Microphone error. Please ensure permissions are granted.');
    } else if (e.error?.code === '11') {
      console.log("Didn't understand. Please try again.");
    }
  };

  const clearSearch = () => {
    setIsInputEmpty(true);
    setAddress('');
    if (placesRef?.current) {
      placesRef.current.setAddressText('');
    }
  };

  const checkInputEmpty = (input: string) => {
    setIsInputEmpty(input.trim().length > 0);
  };

  const getCoordinates = async (locationName: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationName,
        )}&key=${'AIzaSyDbOfusA5U9qee5ZPfNOTO82OH3an23m0g'}`,
      );

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setRegion({
          latitude: location?.lat,
          longitude: location?.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startListening = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
          return;
        }
      }
      if (placesRef?.current) {
        placesRef.current?.focus();
      }
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      const line0 = `We are on Search Screen. You are currently seeing ${address} on the map`;
      let content = `${line0}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  useEffect(() => {
    // console.log(location, "location");
    if (location) {
      setRegion({
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      // getCurrentLocation();
    }
  }, [location]);

  const handleContinue = () => {
    let location = {
      latitude: region?.latitude,
      longitude: region?.longitude,
    };

    if (userRole !== 3) {
      dispatch(saveLocation(location));
      dispatch(saveLocationName(address || locationName));
      navigation.goBack();
    } else if (EditProp === true) {
      navigation.goBack();
    } else {
      dispatch(saveLocation(location));
      dispatch(saveLocationName(address || locationName));
      navigation.navigate('signUp');
    }
  };

  const handleFilter = () => {
    navigation.navigate('filterScreen', { back: false });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        let location = {
          latitude: latitude,
          longitude: longitude,
        };
        getAddressFromCoordinates(latitude, longitude)
          .then(address => {
            dispatch(saveLocationName(address));
            dispatch(saveLocation(location));
          })
          .catch(error => {
            console.log('error: ', error);
          });
        setIsSearching(false);
        // dispatch(saveLocationName(placeName))
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000); // 1000ms animation duration
        }
        if (onLocationSelected) {
          onLocationSelected(latitude, longitude, address);
        }
      },
      error => {
        console.log('Error getting current location: ', error);
      },
    );
  };


  const handleAddressChange = (text: string) => {
    setAddress(text);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={newRegion => {
              setIsSearching(false);
            }}>
            <Circle
              style={styles.markerContainer}
              center={region}
              radius={400}
              strokeColor="rgba(255, 102, 102, 0.5)"
              fillColor="rgba(255, 102, 102, 0.2)"
            />
            <Marker coordinate={region} anchor={{ x: 0.5, y: 0.5 }}>
              <View
                style={[
                  styles.markerContainer,
                  { backgroundColor: Colors.whiteColor, borderRadius: 100 },
                ]}>
                <GlobalIcon
                  library="Ionicons"
                  name={'navigate-circle'}
                  size={40}
                  color={Colors.redColor}
                />
              </View>
            </Marker>
          </MapView>
          <Pressable
            style={[
              styles.locationIcon,
              {
                bottom: showLocation
                  ? heightPercentageToDP(18)
                  : heightPercentageToDP(9),
              },
            ]}
            onPress={getCurrentLocation}>
            <GlobalIcon
              library="CustomIcon"
              name="Group-1171275076"
              size={24}
              color={Colors.redColor}
            />
          </Pressable>
          <View
            style={[
              styles.mapHeaderView,
              { height: 'auto' },
              Platform.OS === 'ios' && { paddingTop: hp(8) },
            ]}>
            {userRole === 3 && !showLocation ? (
              <View style={styles.headerContainer}>
                <View style={styles.conditionHeader}>
                  <Text style={styles.conditionTitle}>Search</Text>
                  <Pressable onPress={() => ConvertToSpeech()}>
                    <GlobalIcon
                      library="CustomIcon"
                      name="Vector-2"
                      size={27}
                      color={isSpeaking ? Colors.greenColor : Colors.redColor}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.locationHeaderContainer}>
                <Pressable
                  style={{ position: 'absolute', left: verticalScale(20) }}
                  onPress={() => navigation.goBack()}>
                  <GlobalIcon
                    library="Ionicons"
                    name="arrow-back"
                    size={24}
                    color={Colors.blackColor}
                  />
                </Pressable>
                <Text style={[styles.title]}>Location</Text>
              </View>
            )}

            <View style={styles.recentSearches}>
              <View style={styles.mapSubHead}>
                <View
                  style={{
                    ...styles.searchContainer,
                    width: userRole === 3 && !showLocation ? moderateScale(280) : wp(90),
                  }}>
                  <GlobalIcon
                    library="CustomIcon"
                    name="Vector"
                    size={24}
                    color={Colors.greyColor}
                  />
                  <GooglePlacesAutocomplete
                    ref={placesRef}
                    value={address}
                    onChangeText={(text: string) => handleAddressChange(text)}
                    placeholder={
                      "Search"
                    }
                    onPress={(data, details = null) => {
                      if (details) {
                        const { lat, lng } = details.geometry.location;
                        const placeName = data?.description;
                        setAddress(data.description);
                        let location = {
                          latitude: lat,
                          longitude: lng,
                        };

                        dispatch(saveLocation(location));
                        dispatch(saveLocationName(placeName));
                        setRegion({
                          latitude: lat,
                          longitude: lng,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        });
                      }
                      setIsSearching(false);
                    }}
                    query={{
                      key: 'AIzaSyDX5YYnEtkdKa-VjUQ-5JTRN9SgoM0fV9M',
                      language: 'en',
                    }}
                    styles={googlePlaceStyles}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    textInputProps={{
                      onChangeText: text => {
                        checkInputEmpty(text);
                        handleAddressChange(text);
                      },
                      value: address,
                      editable: true,
                      onFocus: () => {
                        console.log('FOCUSED');
                        setIsSearching(true);
                      },

                      onBlur: () => {
                        if (isSearching) {
                          console.log('BLURRED');
                          setIsSearching(false);
                        }
                      },
                    }}
                    debounce={500}
                    onFail={error =>
                      console.error('Google Places API Error:', error)
                    }
                  />
                  {!isInputEmpty == true ? (
                    <Pressable
                      onPress={isListening ? stopListening : startListening}>
                      <GlobalIcon
                        library="CustomIcon"
                        name="Group-1171275968"
                        size={24}
                        color={
                          isListening ? Colors.greenColor : Colors.blackColor
                        }
                      />
                    </Pressable>
                  ) : Platform.OS == 'android' ? (
                    <Pressable
                      onPress={clearSearch}
                    >
                      <GlobalIcon
                        name="close"
                        library="AntDesign"
                        size={24}
                        color={Colors.blackColor}
                      />
                    </Pressable>
                  ) : null}
                </View>
                {userRole === 3 && !showLocation ? (
                  isSearching ? null : (
                    <Pressable style={styles.filterView} onPress={handleFilter}>
                      <FilterIcon />
                    </Pressable>
                  )
                ) : null}
              </View>
            </View>
            {userRole === 3 ||
              isSearching ||
              placesRef?.current?.isFocused() ? null : (
              <Pressable
                style={styles.currentLocationButton}
                onPress={getCurrentLocation}>
                <GlobalIcon
                  library="CustomIcon"
                  name="Group-1171275076"
                  size={23}
                  color={Colors.greyColor}
                />
                <Text style={styles.currentLocationText}>
                  Use my current location
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>

        {showLocation && (
          <View style={styles.bottomContainer}>
            <CustomButton
              title="Continue"
              onPress={handleContinue}
              buttonStyle={styles.continueButton}
              textStyle={styles.continueButtonText}
            />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  mapHeaderView: {
    height: verticalScale(155),
    flexDirection: 'column',
    backgroundColor: Colors.whiteColor,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(10),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    alignItems: 'center',
  },
  mapSubHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(5),
    gap: 17,
  },
  filterView: {
    width: moderateScale(45),
    height: verticalScale(48),
    backgroundColor: Colors.redOrange,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    marginBottom: verticalScale(20),
    // textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: 8,
    paddingHorizontal: moderateScale(15),
    height: verticalScale(48),
    width: moderateScale(300),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: Colors.greyColor,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(12),
    alignSelf: 'flex-start',
    paddingLeft: moderateScale(12),
    width: moderateScale(300),
    alignContent: 'center',
  },
  currentLocationText: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    // fontFamily: Fonts.InterRegular,
    color: Colors.greyColor,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // width: '100%',
    // height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  bottomConditionContainer: {
    position: 'absolute',
    bottom: verticalScale(33),
    left: hp(40),
    right: 0,
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: Colors.whiteColor,
    width: 50,
    height: 50,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: 60,
    height: verticalScale(50),
    width: '90%',
  },
  continueButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(12),
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
  },
  recentSearchesContainer: {
    // paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
    // height: verticalScale(255),
    height: verticalScale(400),
    // height: 'auto'
  },
  recentSearchesTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    marginBottom: verticalScale(15),
  },
  establishmentFlatListStyle: {
    flexGrow: 1,
    gap: 20,
    flexDirection: 'row',
    // backgroundColor: 'red',
    paddingVertical: verticalScale(7),
    paddingHorizontal: moderateScale(12),
  },
  establishmentItem: {
    width: moderateScale(320),
    height: verticalScale(65),
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    flexDirection: 'row',
  },
  establishmentImage: {
    borderRadius: 8,
  },
  establishmentInfo: {
    marginTop: verticalScale(8),
  },
  nameAndDistanceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(8),
  },
  establishmentName: {
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterBold,
  },
  establishmentType: {
    fontSize: moderateScale(14),
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterRegular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(7),
    gap: 12,
    paddingVertical: verticalScale(4),
  },
  ratingText: {
    marginLeft: moderateScale(4),
    color: Colors.greenAndGreyMixColor,
    fontFamily: Fonts.InterRegular,
    fontSize: moderateScale(14),
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  distanceText: {
    marginLeft: moderateScale(4),
    fontSize: moderateScale(16),
    color: Colors.blackColor,
    fontFamily: Fonts.InterRegular,
  },
  recentSearches: {
    flex: 1,
    flexDirection: 'column',
  },

  locationHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'flex-start',
    paddingHorizontal: verticalScale(20),
  },
  locationIcon: {
    zIndex: 1,
    bottom: heightPercentageToDP(9),
    right: widthPercentageToDP(6),
    backgroundColor: 'white',
    position: 'absolute',
    padding: heightPercentageToDP(2),
    borderRadius: 50,
  },
  closeButton: {
    position: 'absolute',
    right: wp(10),
    top: 15,
  },
});
const googlePlaceStyles = {
  textInput: {
    fontSize: 16,
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  predefinedPlacesDescription: {
    color: Colors.blackColor,
  },
  description: {
    color: Colors.blackColor,
  },
  listView: {
    position: 'absolute',
    top: hp(10),
    zIndex: 10,
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.lightestGrey,
    borderWidth: 1,
    borderRadius: 5,
    width: wp(88),
    marginLeft: wp(-8),
    elevation: 5,
  },
  row: {
    backgroundColor: Colors.whiteColor,
    padding: 10,
  },
};
export default LocationSelectionScreen;
