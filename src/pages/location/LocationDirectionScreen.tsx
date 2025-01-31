import NetInfo from '@react-native-community/netinfo';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections, {
  MapViewDirectionsMode,
} from 'react-native-maps-directions';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/CustomInput';
import {
  AllModesDistanceTimeTypes,
  DistanceTimeTypes,
  TravelModeItemProps,
} from '../../interfaces/Interfaces';
import Tts from '../../services/textToSpeech';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setGlobalOrigin } from '../../store/user/UserSlice';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { googlePlaceStyles } from '../../utlis/ReusableStyles';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';
import { openGoogleMaps } from '../../utlis/functions';
const {moderateScale, verticalScale} = SizeMattersConfig;

const TravelModeItem: React.FC<TravelModeItemProps> = ({
  icon,
  time,
  isSelected,
  onPress,
}) => (
  <Pressable
    style={[styles.travelModeItem, isSelected && styles.selectedTravelMode]}
    onPress={onPress}>
    <GlobalIcon
      library="CustomIcon"
      name={icon}
      size={24}
      color={isSelected ? Colors.redColor : Colors.blackColor}
    />
    <Text
      style={[
        styles.travelModeTime,
        isSelected && styles.selectedTravelModeTime,
      ]}>
      {time}
    </Text>
  </Pressable>
);

const LocationDirectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const hotelLocation = useAppSelector(state => state.userSlice.hotelLocation);
  const globalOrigin = useAppSelector(state => state.userSlice.globalOrigin);
  const globalDestination = useAppSelector(
    state => state.userSlice.globalDestination,
  );
  console.log('globalOrigin', globalOrigin);
  console.log('globalDestination', globalDestination);

  const apiKey = 'AIzaSyDX5YYnEtkdKa-VjUQ-5JTRN9SgoM0fV9M';
  const modeIcons = ['Icon', 'Icon-1', 'Icon-2', 'Icon-3'];
  const modes = [
    'DRIVING',
    'TRANSIT',
    'WALKING',
    'BICYCLE',
  ] as MapViewDirectionsMode[];

  const dispatch = useAppDispatch();

  const mapref = useRef<MapView>(null);
  const googlePlacesRef = useRef<GooglePlacesAutocomplete | null>(null);
  const inputRef = useRef<TextInput>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [myLocationInputFocused, setMyLocationInputFocused] = useState(false);
  const [isFetchingDistanceTime, setIsFetchingDistanceTime] = useState(false);
  const [allModesDistanceTime, setAllModesDistanceTime] = useState<
    AllModesDistanceTimeTypes[]
  >([]);
  const [distanceTime, setDistanceTime] = useState<DistanceTimeTypes>({
    distance: 0,
    duration: 0,
    mode: 'DRIVING',
  });
  const {control, setValue} = useForm({
    defaultValues: {
      myLocation: '',
      hotelExactLocation: '',
    },
  });

  useEffect(() => {
    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    return () => {
      Tts.stop();
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const readFromApi = () => {
    if (allModesDistanceTime.length > 0) {
      return `${allModesDistanceTime?.map(item => {
        if (item.duration) {
          return `By ${item.mode}! it will take ${item.duration}!`;
        }
      })}!`;
    }
  };

  const ConvertToSpeech = () => {
    if (!isSpeaking) {
      let lineNegative1 = 'You are currently on Location Direction Screen!';

      let line0 = '';
      let line1 = '';
      let line2 = '';
      let line3 = '';

      if (!globalOrigin?.title && !globalDestination?.title) {
        line0 = `On this screen! You can select an origin location! and a destination location! The results show the time it will take for a car! bus! a human! and a
               cycler to reach the destination from the origin! based on the distance!`;
      }

      if (globalOrigin?.title && !globalDestination?.title) {
        line0 = `On this screen! You have selected an origin location! ${globalOrigin?.title}! Now you can select a destination location! The results show the time it will take for a car! bus! a human! and a
               cycler to reach the destination from the origin! based on the distance!`;
      }
      if (globalOrigin?.title && globalDestination?.title) {
        line0 = `On this screen! You have selected an origin location! ${globalOrigin?.title}! and a destination location! ${globalDestination?.title} 
                The results show the time it will take for a car! bus! a human! and a
               cycler to reach the destination from the origin! based on the distance!`;
        line1 = `${
          distanceTime.duration
            ? `Currently the origin and location are ${distanceTime.distance} apart and it will take ${distanceTime.duration}`
            : ''
        }`;
        line2 = `${readFromApi()}`;
        line3 =
          'At the bottom of the screen we have a Start button! and a Share button';
      }

      let content = `
             ${lineNegative1}
               ${line0}
               ${line1}
              ${line2}
              ${line3}`;

      Tts.speak(content);
    } else {
      Tts.stop();
    }
  };

  const displayRoutes = async () => {
    if (globalOrigin?.title && globalDestination?.title) {
      setValue('myLocation', globalOrigin?.title);
      if (googlePlacesRef.current) {
        googlePlacesRef.current.setAddressText(globalOrigin?.title);
      }
      setValue('hotelExactLocation', globalDestination.title);
      const res = await getDirections(
        `${globalOrigin.latitude},${globalOrigin.longitude}`,
        `${globalDestination.latitude},${globalDestination.longitude}`,
      );

      if (!res[0]?.mode) {
        return;
      }
      if (res?.length === 4) {
        setAllModesDistanceTime(res);
      }

      setDistanceTime({
        distance: res[0]?.distance,
        duration: res[0]?.duration,
        mode: res[0]?.mode,
      });
    }
  };

  const handleContentSizeChange = () => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({
        selection: {start: 0, end: 0},
      });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({
        scrollEnabled: true,
      });

      inputRef.current.setNativeProps({
        selection: {start: 0, end: 0},
      });
    }
  }, [inputRef]);

  useEffect(() => {
    displayRoutes();
  }, [hotelLocation?.title, route?.params]);

  const getDirections = async (origin: string, destination: string) => {
    setIsFetchingDistanceTime(true);
    const requests = modes.map(mode =>
      axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin,
          destination,
          mode: mode.toLowerCase(),
          ...(mode === 'DRIVING' && {
            departure_time: 'now',
            traffic_model: 'pessimistic',
          }),
          key: apiKey,
        },
      }),
    );

    try {
      const responses = await Promise.all(requests);
      const results = responses.map((response, index) => {
        const route = response.data.routes?.[0];
        if (route) {
          const leg = route.legs?.[0];
          if (leg) {
            console.log(
              'leg.duration_in_traffic.text',
              leg?.duration_in_traffic?.text,
            );
            console.log('leg.duration.text', leg?.duration?.text);
            console.log('mode: ----', modes[index]);
            return {
              mode: modes[index],
              distance: leg.distance.text,
              duration: leg.duration.text,
              Icon: modeIcons[index],
            };
          }
        } else
          return {
            mode: modes[index],
            distance: 'No route found',
            duration: '',
            Icon: modeIcons[index],
          };
      });
      return results;
    } catch (error: any) {
      console.log('Error fetching directions:', error);
      console.log('Error fetching directions message:', error?.message);
      setDistanceTime({
        distance: 'Failed to find distance. Please try again later',
        duration: '',
        mode: 'DRIVING',
      });
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected === false) {
        Alert.alert('', 'No Internet Connection');
      }
      throw error;
      return [];
    } finally {
      setIsFetchingDistanceTime(false);
    }
  };

  const openGoogleMapsApp = async () => {
    if (!globalOrigin?.title || !globalDestination?.title) {
      return;
    }
    await openGoogleMaps({
      origin: {
        latitude: globalOrigin?.latitude,
        longitude: globalOrigin?.longitude,
      },
      destination: {
        latitude: globalDestination?.latitude,
        longitude: globalDestination?.longitude,
      },
      travelMode: distanceTime.mode.toLowerCase(),
    });
  };

  const shareRoute = () => {
    const originString = `${globalOrigin?.latitude},${globalOrigin?.longitude}`;
    const destinationString = `${globalDestination?.latitude},${globalDestination?.longitude}`;
    const travelMode = distanceTime?.mode;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originString}&destination=${destinationString}&travelmode=${travelMode}`;

    Share.share({
      message: `Check out this route: ${googleMapsUrl}`,
      url: googleMapsUrl,
    });
  };

  const handleOriginLocationPress = async (data: any, details: any) => {
    if (!details?.geometry?.location?.lat) {
      return;
    }
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    console.log('data description', data.description, lat, lng);

    let origin = {
      latitude: lat,
      longitude: lng,
      title: data.description,
    };

    dispatch(setGlobalOrigin(origin));

    if (globalDestination?.title) {
      const res = await getDirections(
        `${lat},${lng}`,
        `${globalDestination.latitude},${globalDestination.longitude}`,
      );

      if (res?.length === 4) {
        setAllModesDistanceTime(res);
      }

      if (!res[0]?.mode) {
        return;
      }
      setDistanceTime({
        distance: res[0]?.distance,
        duration: res[0]?.duration,
        mode: res[0]?.mode,
      });
    }

    Keyboard.dismiss();
  };

  const fitToBoundsWithSlowAnimation = (
    coordinates: {latitude: number; longitude: number}[],
  ) => {
    if (mapref.current && coordinates.length > 0) {
      let minLat = coordinates[0].latitude;
      let maxLat = coordinates[0].latitude;
      let minLng = coordinates[0].longitude;
      let maxLng = coordinates[0].longitude;

      coordinates.forEach(coord => {
        minLat = Math.min(minLat, coord.latitude);
        maxLat = Math.max(maxLat, coord.latitude);
        minLng = Math.min(minLng, coord.longitude);
        maxLng = Math.max(maxLng, coord.longitude);
      });
      const PADDING = 0.2;
      const latDelta = (maxLat - minLat) * (1 + PADDING);
      const lngDelta = (maxLng - minLng) * (1 + PADDING);

      mapref.current.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max(latDelta, 0.01),
          longitudeDelta: Math.max(lngDelta, 0.01),
        },
        3000,
      );
    }
  };
  return (
    <KeyboardAwareScrollView bounces={false} contentContainerStyle={styles.content}>
      <View style={styles.HeaderView}>
        <View style={styles.locationInputs}>
          <View style={styles.locationMarkers}>
            <View style={[styles.marker, styles.startMarker]} />
            <View style={styles.markerLine} />
            <GlobalIcon
              library="CustomIcon"
              name="Vector-4"
              size={20}
              color={Colors.redColor}
            />
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputViewIcon}>
              <Controller
                control={control}
                name={'myLocation'}
                render={({field: {onChange, value, onBlur}}) => (
                  <GooglePlacesAutocomplete
                    ref={googlePlacesRef}
                    placeholder={'Your Location'}
                    fetchDetails
                    onPress={(data, details) =>
                      handleOriginLocationPress(data, details)
                    }
                    textInputProps={{
                      onFocus: () => setMyLocationInputFocused(true),
                      onBlur: () => setMyLocationInputFocused(false),
                      style: styles.originTextInput,
                      value: value,
                      onChangeText: text => {
                        onChange(text);
                      },
                      placeholderTextColor: '#888888',
                    }}
                    renderRightButton={() => (
                      <Pressable
                        onPress={ConvertToSpeech}
                        style={[
                          styles.leftIcon,
                          {marginRight: verticalScale(15)},
                        ]}>
                        <GlobalIcon
                          library="CustomIcon"
                          name="Vector-2"
                          size={24}
                          color={
                            isSpeaking ? Colors.greenColor : Colors.redColor
                          }
                        />
                      </Pressable>
                    )}
                    query={{key: apiKey, language: 'en'}}
                    enablePoweredByContainer={false}
                    styles={googlePlaceStyles}
                  />
                )}
              />
            </View>

            <View style={styles.inputViewIcon}>
              <Controller
                control={control}
                name={'hotelExactLocation'}
                render={({field: {onChange, value}}) => (
                  <InputField
                    InputTextRef={inputRef}
                    editable={false}
                    topContainerStyle={styles.input}
                    placeholder="Hotel Inn"
                    onChangeText={onChange}
                    onContentSizeChange={handleContentSizeChange}
                    value={value}
                    autoCorrect={false}
                    autoCapitalize="none"
                    textContentType="none"
                    secureTextEntry={false}
                    textAlign="left"
                    selection={{start: 0, end: 0}}
                  />
                )}
              />
            </View>
          </View>
        </View>
        {isFetchingDistanceTime ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.redColor}
            style={{marginTop: verticalScale(22)}}
          />
        ) : (
          allModesDistanceTime?.length > 0 && (
            <FlatList
              contentContainerStyle={styles.travelModes}
              horizontal
              data={allModesDistanceTime}
              renderItem={({
                item,
                index,
              }: {
                item: AllModesDistanceTimeTypes;
                index: number;
              }) => {
                return (
                  <TravelModeItem
                    icon={item.Icon}
                    time={item.duration}
                    isSelected={distanceTime.mode === modes[index]}
                    onPress={() => {
                      setDistanceTime({
                        distance: item.distance || 'No route found',
                        duration: item.duration,
                        mode: item.mode,
                      });
                    }}
                  />
                );
              }}
            />
          )
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView ref={mapref} style={{flex: 1}}>
          {globalOrigin?.latitude && globalDestination?.longitude ? (
            <MapViewDirections
              origin={globalOrigin}
              destination={globalDestination}
              apikey={apiKey}
              strokeWidth={3}
              strokeColor={'red'}
              mode={distanceTime.mode}
              onReady={result => {
                fitToBoundsWithSlowAnimation(result.coordinates);
              }}
              onStart={() => {
                console.log('Started routing');
              }}
              onError={errorMessage => {
                console.log('Error with MapViewDirections:', errorMessage);
              }}
            />
          ) : null}

          {globalOrigin?.latitude ? (
            <Marker coordinate={globalOrigin} title={globalOrigin.title} />
          ) : null}

          {globalDestination?.latitude ? (
            <Marker
              coordinate={globalDestination}
              title={globalDestination.title}
            />
          ) : null}
        </MapView>
      </View>

      {globalOrigin?.latitude &&
        globalDestination?.latitude &&
        !myLocationInputFocused && (
          <View style={styles.FooterView}>
            <View style={styles.footerHead}>
              <View style={styles.travelInfo}>
                <Text style={styles.travelTime}>
                  {distanceTime?.duration
                    ? `${distanceTime?.duration} `
                    : `${distanceTime?.duration}`}
                  <Text
                    style={{
                      ...styles.travelTime,
                      color: distanceTime?.duration
                        ? Colors.greyColor
                        : Colors.blackColor,
                    }}>{`${distanceTime.distance}`}</Text>
                </Text>
                <Text style={styles.travelAddress}>
                  {globalDestination?.title
                    ? globalDestination.title
                    : globalOrigin?.title
                    ? globalOrigin?.title
                    : ''}
                </Text>
              </View>
              <Pressable onPress={() => navigation.goBack()}>
                <GlobalIcon
                  library="Feather"
                  name="x"
                  size={25}
                  color={Colors.blackColor}
                />
              </Pressable>
            </View>
            <View style={styles.actionButtons}>
              <CustomButton
                title="Start"
                onPress={openGoogleMapsApp}
                leftIcon={
                  <GlobalIcon
                    library="MaterialIcons"
                    name="navigation"
                    size={24}
                    color={Colors.whiteColor}
                  />
                }
                buttonStyle={styles.startButton}
                textStyle={styles.startButtonText}
              />
              <CustomButton
                title="Share"
                onPress={shareRoute}
                leftIcon={
                  <GlobalIcon
                    library="CustomIcon"
                    name="share-2-1"
                    size={22}
                    color={Colors.redColor}
                  />
                }
                buttonStyle={styles.shareButton}
                textStyle={styles.shareButtonText}
              />
            </View>
          </View>
        )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    marginBottom: ResponsiveSizes.hp(0.5),
  },
  travelModeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
    height: verticalScale(25),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    gap: 5,
  },
  selectedTravelMode: {
    backgroundColor: Colors.lightestBlueColor,
    borderWidth: 1,
    borderColor: Colors.lightBlue,
    borderRadius: 28,
  },
  travelModeTime: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
    fontFamily: Fonts.InterMedium,
  },
  selectedTravelModeTime: {
    color: Colors.redColor,
    fontSize: moderateScale(14),
    fontFamily: Fonts.InterMedium,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  originTextInput: {
    flex: 1,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(12),
    color: Colors.blackColor,
  },
  content: {
    flex: 1,
  },
  HeaderView: {
    backgroundColor: Colors.whiteColor,
    padding: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    width: '100%',
    paddingTop: Platform.OS == 'ios' ? verticalScale(45) : verticalScale(15),
  },
  locationInputs: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
    alignItems: 'stretch',
  },
  locationMarkers: {
    top: Platform.OS == "ios" ? verticalScale(10) : verticalScale(19),
    width: moderateScale(24),
    alignItems: 'center',
    marginRight: moderateScale(8),
  },
  marker: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: Colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  startMarker: {
    backgroundColor: Colors.redColor,
  },
  endMarker: {
    backgroundColor: Colors.redColor,
    marginTop: 'auto',
  },
  markerLine: {
    width: 1,
    marginVertical: verticalScale(4),
    height: verticalScale(47),
    borderWidth: 2,
    borderColor: Colors.lightGreyColor,
    borderStyle: 'dashed',
  },
  inputsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: verticalScale(20),
  },
  inputViewIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainInputStyle: {
    width: moderateScale(280),
    height: verticalScale(40),
    textAlign: 'center',
  },
  travelModes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(0),
  },

  mapContainer: {
    flex: 1,
    borderRadius: moderateScale(8),
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  travelInfo: {
    width: '90%',
    marginBottom: verticalScale(16),
  },
  travelTime: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(4),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
  },
  travelAddress: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
    fontFamily: Fonts.InterMedium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: moderateScale(44),
    width: '48%',
    marginRight: moderateScale(12),
    // height: verticalScale(40),
  },
  startButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
    fontFamily: Fonts.InterMedium,
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.redColor,
    borderWidth: 1,
    borderRadius: moderateScale(44),
    // height: verticalScale(40),
    width: '48%',
  },
  shareButtonText: {
    color: Colors.redColor,
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
    fontFamily: Fonts.InterMedium,
  },
  FooterView: {
    padding: moderateScale(15),
    backgroundColor: Colors.whiteColor,
    width: '100%',
    height: 'auto',
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  footerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  leftIcon: {justifyContent: 'center', alignItems: 'center', paddingLeft: 10},
  inputContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: verticalScale(12),
    width: '90%',
  },
});

export default LocationDirectionScreen;
